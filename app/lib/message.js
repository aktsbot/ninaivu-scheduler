import MessageReceipt from '../models/message_receipt.model.js'

export const filterPatientsFromToSendList = async ({ date, patients }) => {
  let list = patients.map(p => p._id)
  try {

    let start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);

    let end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);

    const receipts = await MessageReceipt.find({
      date: {
        $lt: end,
        $gte: start
      },
      patient: {
        $in: list
      }
    }).lean()

    if (receipts.length) {
      list = list.filter(l => l != receipts.patient)
    }
  } catch (error) {
    console.log(error)
  }
  return list;
}
