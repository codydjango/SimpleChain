const { NotFoundException, ValidationException } = require('exceptions')

/**
* Generic error handler. Any uncaught thrown error will be handled
* appropriately according to business logic. Because this is an
* API we want messages to be helpful to other developers, without
* exposing anything sensitive about our own backend system.
*
* @param  {Error} err the bubbled Error
* @param  {Request} req Express request instance
* @param  {Response} res Express response instance
* @param  {Function} next Express middleware instance
*/
function errorHandler (err, req, res, next) {
    switch (true) {
        case err instanceof NotFoundException:
            return res.status(404).json({
                status: err.message
            })
        case err instanceof ValidationException:
            return res.status(422).json({
                status: err.message,
                payload: err.data
            })
        default:
            // uncaught error, notify admin
            return res.status(500).json({
                status: (err.message) ? `server error: ${ err.message }` : 'server error'
            })
    }

    res.status(code).json(body)
}

module.exports = errorHandler
