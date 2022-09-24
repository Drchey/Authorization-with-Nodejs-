const mongoose = require('mongoose')


const connect_DB = async() => {
   try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
   } catch (error) {
    console.log(error.message)
    process.exit(1)
   }
} 


module.exports = connect_DB
