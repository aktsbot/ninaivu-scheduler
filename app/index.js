import cron from 'node-cron'

import config from './config.js'
import { connectDB } from './db.js';
import { filterPatientsFromToSendList, getMessageQueueList, getQueuedCount, getQueuedMessages, insertMessageReceiptEntries, sendMessage } from './lib/message.js';
connectDB()

import { getPatientList } from './lib/patient.js';
import { updateLastRun, updateCreditsRemaining } from './lib/scheduler.js';

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

async function queuer() {
  // find the current date
  //
  // get patients that need to be sent messages on current day
  //
  // check if these patients have entry in the receipts table
  // if yes, remove them from this list
  // if no, add them to this list
  //
  // insert the list into message_receipt collection - status: queued

  await updateLastRun();

  const date = new Date()
  const day = days[new Date().getDay()]
  // const date = '2023-03-27T03:20:01.041Z'
  // const day = 'tuesday'
  const patientsForDay = await getPatientList({ day })
  console.log('patients ', patientsForDay.length)
  if (!patientsForDay.length) {
    console.log('No patients to send for ', day, date)
    return
  }
  const filteredList = await filterPatientsFromToSendList({ date, patients: patientsForDay })
  console.log('filtered ', filteredList.length)
  if (!filteredList.length) {
    console.log('Filtered list returned empty')
    return
  }

  let entries = await getMessageQueueList({ patients: filteredList })
  if (!entries.length) {
    console.log('Entries list returned empty')
    return;
  }

  entries = entries.map(e => ({ ...e, date: date }))
  await insertMessageReceiptEntries({ entries })
  console.log('Inserted new entries ', entries.length)

  return;
}

async function runner() {
  // get tasks that are in the "queued" state
  const queuedCount = await getQueuedCount()
  console.log('To send: ', queuedCount)

  const limit = 10;
  let totalLoops = Math.ceil(queuedCount / limit)

  let mrs = await getQueuedMessages({ limit });
  let loop = 0;
  while (mrs.length && loop < totalLoops) {
    // console.log('loop ', loop)
    for (const mr of mrs) {
      await sendMessage({ m: mr })
      // console.log('  ', mr._id)
    }
    mrs = await getQueuedMessages({ limit });
    loop++;
  }

  console.log('Completed sending messages ')
}

// TODO: queuer will be replace by node-cron
// queuer()
// runner()

cron.schedule('* * * * *', () => {
  console.log('running task every minute');
  queuer()
});

cron.schedule("*/5 * * * *", () => {
  console.log('running task every 5 mins');
  runner()
})

cron.schedule("*/30 * * * *", () => {
  console.log('running task every 30 mins');
  updateCreditsRemaining()
})
