const express = require('express')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')

const blockchain = require('./services/blockchain')
const routes = require('./routes')
const { NotFoundException, ValidationException } = require('./exceptions')

const app = express()
const port = 8000

/**
 * Entrypoint into application. Instantiates blockchain, waits until
 * it's ready and then starts the express server listening on port 8000.
 */
;(async () => {
    await blockchain.onReady()

    app.use(bodyParser.json())
    app.use(expressValidator())
    app.use(routes)
    app.use(errorHandler)
    app.listen(port, () => console.log(`API listening on localhost:${ port }`))
})()

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
