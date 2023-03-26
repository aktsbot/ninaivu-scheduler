import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const PatientSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true,
      default: () => uuidv4(),
    },
    patientId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    mobileNumbers: [
      {
        type: String,
        required: true,
      },
    ],
    notes: {
      type: String,
    },
    messagesEvery: [
      {
        type: String, // sunday, monday, tuesday, wednesday, thursday, friday, saturday
        required: true,
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      default: "active", // active, inactive
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Patient", PatientSchema);
