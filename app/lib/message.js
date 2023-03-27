import MessageReceipt from '../models/message_receipt.model.js'
import Message from '../models/message.model.js'

// https://stackoverflow.com/questions/8636617/how-to-get-start-and-end-of-day-in-javascript
function getStartEnd(date) {
  let start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);

  let end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);

  return { start, end }
}

export const filterPatientsFromToSendList = async ({ date, patients }) => {
  let list = patients.map(p => p._id.toString())
  try {

    const { start, end } = getStartEnd(date)

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
      const receiptPatients = receipts.map(r => r.patient.toString());
      list = list.filter(l => !receiptPatients.includes(l))
    }
  } catch (error) {
    console.log(error)
  }
  return list;
}


// patients will just be an array of ids
export const getMessageQueueList = async ({ patients }) => {

  let list = []

  try {

    for (const p of patients) {
      // get messages that have been sent to the user
      const sent = await MessageReceipt.find({
        user: p
      });
      if (sent) {
        const sentMessageIds = sent.map(s => s.message);
        const unsendMessages = await Message.find({
          _id: { $nin: sentMessageIds }
        });
        if (!unsendMessages.length) {
          // TODO: write to database?
          console.log('Nothing new to send to user ', p)
          continue;
        } else {
          list.push({
            patient: p,
            message: unsendMessages[0]['_id']
          })
        }
      }
    }

  } catch (error) {
    console.log(error)
  }

  return list;

}

export const insertMessageReceiptEntries = async ({ entries }) => {
  try {
    await MessageReceipt.insertMany(entries)
  } catch (error) {
    console.log(error)
  }
}

export const getQueuedCount = async () => {
  try {
    return await MessageReceipt.countDocuments({ status: 'queued' })
  } catch (error) {
    console.log(error)
    return 0
  }
}

export const getQueuedMessages = async ({ limit }) => {
  try {
    // console.log(limit, skip)
    return await MessageReceipt.find({
      status: 'queued'
    }, { uuid: 1, patient: 1, message: 1, date: 1, status: 1, notes: 1 }, {
      limit
    }).populate('message').populate('patient').lean()
  } catch (error) {
    console.log(error)
    return []
  }
}


// TODO: doing the actual message sending
// currently it just changes the status
export const sendMessage = async ({ m }) => {
  try {
    const messageInfo = await MessageReceipt.updateOne({ _id: m._id }, { $set: { status: 'sent' } });
    // console.log(messageInfo)
    return true
  } catch (error) {
    console.log(error)
    await MessageReceipt.updateOne({ _id: id }, {
      $set: {
        status: 'failed', notes: {
          $concat: ["$notes", error.message]
        }
      }
    });
    return false
  }
}
