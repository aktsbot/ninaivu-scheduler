import mongoose from "mongoose";

// everytime the scheduler runs, this collection gets
// a row insert

const SchedulerSchema = new mongoose.Schema(
  {
    credits: {
      type: Number,
      default: 0,
    },
    ranOn: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Scheduler", SchedulerSchema)
