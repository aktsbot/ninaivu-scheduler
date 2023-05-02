import Patient from '../models/patient.model.js'

export const getPatientList = async ({ day }) => {
  // day is the name of the day in lowercase: sunday, monday ...
  let list = [];
  try {
    const patients = await Patient.find({
      messagesEvery: day,
      notes: { $ne: "test-user" },
    }, {
      _id: 1, uuid: 1, mobileNumbers: 1
    }).lean()

    list = [...patients]
  } catch (error) {
    console.log(error)
  }
  return list
} 
