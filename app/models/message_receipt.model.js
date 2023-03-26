
import mongoose from "mongoose";
import { v4 as uuid4 } from "uuid"; // uuid.v4() gives uuids

const MessageReceiptSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: uuid4,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    date: {
      type: Date,
    },
    status: {
      type: String, // queued, sent, failed
      default: 'queued'
    },
    notes: {
      type: String
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("MessageReceipts", MessageReceiptSchema);
