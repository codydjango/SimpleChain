// node_modules
const express = require('express')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')

// ours
const blockchain = require('services/blockchain')
const errorHandler = require('middleware/errorHandler')
const routes = require('routes')
const output = require('utilities/output')

// constants
const PORT = 8000

/**
 * Entrypoint into application. Instantiates blockchain, waits until
 * it's ready and then starts the express server listening on port 8000.
 */
;(async () => {
    await blockchain.onReady()

    express()
        .use(bodyParser.json())
        .use(expressValidator())
        .use(routes)
        .use(errorHandler)
        .listen(PORT, () => output(`API listening on localhost:${ PORT }`, 'green'))
})()
