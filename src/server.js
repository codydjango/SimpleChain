// node_modules
const express = require('express')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')

// ours
const blockchain = require('services/blockchain')
const errorHandler = require('middleware/errorHandler')
const routes = require('routes')

// constants
const PORT = 8000

/**
 * Entrypoint into application. Instantiates blockchain, waits until
 * it's ready and then starts the express server listening on port 8000.
 */
;(async () => {
    await blockchain.onReady()

    const app = express()

    app.use(bodyParser.json())
    app.use(expressValidator())
    app.use(routes)
    app.use(errorHandler)
    app.listen(PORT, () => console.log(`API listening on localhost:${ PORT }`))
})()
