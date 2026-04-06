import mongoose from "mongoose";
import config from "./config.js";

async function connectDB() {
  try {
    await mongoose.connect(config.MONGODB_URL);
    console.log("Database connected successfully.");
  } catch (error) {
    console.log("DB connection error:", error.message);
    process.exit(1);
  }
}

export default connectDB;
