const User = require('../models/Users.js')
const ErrorResponse = require("../utils/errorResponse")
const sendEmail = require('../utils/sendEmail.js')
const crypto = require('crypto')

exports.register =async (req, res, next) =>{ //register a User ; Require User
    const {username, email, password} = req.body
    try {

        // User Create 
        const user = await User.create({
            username, email, password //Password PreHashed in UserModel
        })

        generateToken(user, 201, res)

    } catch (error) {
       next(error)
    }


}

exports.login = async(req, res, next) =>{  //User Log
    
    const {email, password } = req.body
    if(!email || !password){
        return next(new ErrorResponse("Please Provide Email & Password"))
    }

    try {
        const user = await User.findOne({email}).select("+password")
        if(!user){
            return next(new ErrorResponse("Invalid Credentials", 401))
        }

        const isMatch = await user.matchPasswords(password)

        if(!isMatch){
            return next(new ErrorResponse("Invalid Credentials", 401))
            
        }
        generateToken(user, 200, res)
      

    } catch (error) {
       next(error)
    }
}

exports.forgotpassword = async(req, res, next) =>{ //GEt Email & 
    const {email} = req.body
    try {
        const user = await User.findOne({email})

        if(!user){
            return next(new ErrorResponse("Could not be Sent", 404))
        }
        // Generate Reset  Token
        const resetToken = user.getResetPasswordToken()
        await user.save() 

        // Reset to Token to email
        const resetUrl = `http://localhost:3000/passwwordreset/${resetToken}`
        const message = `<h4>Dear User, You have Requested for Password Reset</h4>
            <a href="${resetUrl} clicktracking=off >${resetUrl}>
            <p>
            Click Link to Reset Password
        </p
        </a>
        `

        // Send to Email

        try {
            await sendEmail({
                to:user.email,
                subject: "Password Reset",
                text:message
            })
            res.status(200).json({success:true, data:"Email Sent"})
        } catch (error) {
            user.getResetPasswordToken = undefined
            user.getResetPasswordExpire = undefined
            await user.save()

            return next(new ErrorResponse("Email Could not be Sent", 500))
        }

    } catch (error) {
        next(error)
    }
}


exports.resetpassword = async(req, res, next) =>{
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex")
    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire:{$gt: Date.now()} //check expiration date is greater than now
        })

        if(!user){
            return next(new ErrorResponse("Token is Now Invalid", 400))
        }

        user.password = req.body.password
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save()
        return res.status(201).json({
            success:true,
            data:"Password Reset Successful"
        })
    } catch (error) {
        next(error)
    }
}





// Send Token

generateToken = (user, statusCode, res) =>{
    const token = user.getSignedToken()
    res.status(statusCode).json({success:true, token})
}