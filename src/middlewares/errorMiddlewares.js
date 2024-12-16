const errors = require('../helpers/errorsManager')

const errorMiddleware = async (err, req, res, next) =>{
    try {
        console.log(err)
        const errorDetails = errors[err.message] || errors['SERVER_ERROR']

        res.status(errorDetails.code).json(errorDetails)
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    errorMiddleware
}