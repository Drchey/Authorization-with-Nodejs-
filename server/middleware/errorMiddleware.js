const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) =>{

    // Create Error Variable and Spread

    let error = { ...err}
    error.message = err.message
    
    // Check error code

    if(err.code == 11000){ // 11000 : Duplicate Error Key
        const message = "Duplicate Field Value"
        error = new ErrorResponse(message, 400)
    }

    if(err.name ===  "ValidationError") { //Name is Validation Error 
        const message = Object.values(err.errors).map((val) => val.message)
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({
        success:false,
        error:error.message || "Server Error"
    })

}

module.exports = errorHandler