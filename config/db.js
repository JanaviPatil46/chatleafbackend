const mongoose = require('mongoose');
const dotenv = require('dotenv')

dotenv.config()

// const MONGODB_URL = process.env.MONGODB_URI

const dbconnect = async()=>{
  try {
    // Connect to the MongoDB database
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

module.exports = dbconnect