import { connectDB } from './db.js';
import { filterPatientsFromToSendList, getMessageQueueList, getQueuedCount, insertMessageReceiptEntries, sendMessage } from './lib/message.js';
connectDB()

import { getPatientList } from './lib/patient.js';

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thrusday', 'friday', 'saturday'];

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

  // const m = await sendMessage({ id: '64200022829a623ed0b57919' })
  // console.log(m)
}

// TODO: queuer will be replace by node-cron
// queuer()
runner()

