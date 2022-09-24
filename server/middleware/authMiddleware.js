const jwt = require('jsonwebtoken')
const User = require('../models/Users')
const ErrorResponse = require('../utils/errorResponse')

exports.protect = async(req, res, next ) =>{
    let token

   
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){ // Check if Authorization Exists in Headers
        token = req.headers.authorization.split(" ")[1]

    }

    if(!token){ //if token doesn't exist
            return next(new ErrorResponse("Not Authorized", 401))
        }  
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)

        if(!user){
            return next(new ErrorResponse("Not Authorized", 401))
        }

        req.user = user
        next()
    } catch (error) {
        return next(new ErrorResponse("Not Authorized", 401))
    }

}