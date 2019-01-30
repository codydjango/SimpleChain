const express = require('express')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const BlockChain = require('./BlockChain.js')
const Block = require('./Block.js')

const app = express()
const port = 8000
const myBlockChain = new BlockChain()

const listening = () => console.log(`API listening on localhost:${port}`)
const http404 = (req, res) => res.status(404).json({ status: 'not found' })



;(async () => {
    await myBlockChain.onReady()

    app.use(bodyParser.json())
    app.use(expressValidator())
    app.use(getRouter())
    app.use(errorHandler)
    app.listen(port, listening)
})()


/**
 * Controller method for getting a block by height.
 *
 * @param  {Request} req Express request instance
 * @param  {Response} res Express response instance
 * @param  {Function} next Express middleware
 */
async function getBlockByHeight(req, res, next) {
    let block

    try {
        block = await myBlockChain.getBlock(req.params.height)
        res.json(block)
    } catch (err) {
        next(err)
    }
}

/**
 * Controller method for posting a block. Returns the block.
 *
 * @param  {Request} req Express request instance
 * @param  {Response} res Express response instance
 * @param  {Function} next Express middleware
 */
async function postBlock(req, res, next) {
    let block

    try {
        block = await Block.create(req.body.body)
        block = await myBlockChain.addBlock(block)
        res.json(block)
    } catch (err) {
        next(err)
    }
}

/**
 * Utility factory function for Express router.
 *
 * @return {Router} the express router
 */
function getRouter() {
    const router = express.Router()

    router.post('/block', checkBody, postBlock)
    router.get('/block/:height', getBlockByHeight)
    router.get('*', http404)

    return router
}

/**
 * Validation method for Express-Validator middleware.
 *
 * @param  {Request} req Express request instance
 * @param  {Response} res Express response instance
 * @param  {Function} next Express middleware
 */
function checkBody(req, res, next) {
    req.check('body', 'Body is required').notEmpty()

    const errors = req.validationErrors()

    if (errors) return res.status(422).json(errors)

    next()
}

/**
 * Generic error middleware.
 *
 * @param  {Error} err the bubbled Error
 * @param  {Request} req Express request instance
 * @param  {Response} res Express response instance
 * @param  {Function} next Express middleware instance
 */
function errorHandler (err, req, res, next) {
    let code, message

    if (err.message === '404') {
        code = 404
        message = 'not found'
    } else {
        code = 500
        message = 'server error'
    }

    res.status(code).json({status: message })
}
