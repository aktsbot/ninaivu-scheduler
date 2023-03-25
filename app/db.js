
import mongoose from "mongoose";
import config from "./config.js";

export const connectDB = () => {
  // connecting to database
  mongoose.connect(config.mongodb_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.on("error", () => {
    console.log("mongodb connection error");
  });
  mongoose.connection.once("open", () => {
    console.log("mongodb connection success");
  });
}

export default mongoose;

