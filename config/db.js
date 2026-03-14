const mongoose = require('mongoose');
const dotenv = require('dotenv')

dotenv.config()

// const MONGODB_URL = process.env.MONGODB_URI

const dbconnect = async()=>{
    try{
        const con =await mongoose.connect(process.env.MONGO_URI,{maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        })
        console.log("monodb connected successfully")
    }catch (error) {
console.error(error);
    }
}

module.exports = dbconnect