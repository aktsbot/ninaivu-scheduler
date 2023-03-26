import { connectDB } from './db.js';
import { filterPatientsFromToSendList } from './lib/message.js';
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

  // const date = new Date()
  // const day = days[new Date().getDay()]
  const date = '2023-03-26T03:20:01.041Z'
  const day = 'monday'
  const patientsForDay = await getPatientList({ day })
  console.log('patients ', patientsForDay.length)
  if (!patientsForDay.length) {
    console.log('No patients to send for ', day, date)
    return
  }
  // console.log(patientsForDay)
  const filteredList = await filterPatientsFromToSendList({ date, patients: patientsForDay })
  console.log('filtered ', filteredList.length)
  console.log(filteredList)
  return;
}

// TODO: queuer will be replace by node-cron
queuer()
