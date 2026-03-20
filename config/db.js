require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("Connecting to MongoDB Atlas...");

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Connection Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
