const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, 'Please Provide Username']
    },
    email:{
        type:String,
        required:[true, 'Please Provide Email Address'],
        unique:true,
        // match:[
        //     "[a-z0-9]+@[a-z]+\.[a-z]{2,3}",
        //     "Please Provide a Valid Email Address"
        // ],
        
    },
    password:{
        type:String,
        required: [true, 'Please Add Password'],
        minLength: 6,
        select: false
    },

    resetPasswordToken :String,
    resetPasswordExpire: Date
})


// Hashing Password
UserSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

// Method to check passwords match
UserSchema.methods.matchPasswords = async function(password){
    return await bcrypt.compare(password, this.password)
}

// Methods to Get Signed Token

UserSchema.methods.getSignedToken = function(){
    return jwt.sign({id: this._id},process.env.JWT_SECRET,
         {expiresIn: process.env.JWT_EXPIRES_IN}
         )
}


// Method to Generate Reset Token
UserSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(30).toString("hex")
      
    this.resetPasswordToken =crypto.createHash("sha256").update(resetToken).digest("hex")
    // Add Expiration Time
    this.resetPasswordExpire = Date.now() + 15 * (60 * 1000)

    return resetToken
}


const User = mongoose.model("User", UserSchema)
module.exports = User