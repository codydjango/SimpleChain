const express = require('express')
const BlockController = require('./BlockController')

/**
* Utility factory function for Express router.
* @param  {BlockChain} blockChain instance
* @return {Router} the express router
*/
function getRoutes(blockChain) {
    const routes = express.Router()
    const blockController = new BlockController(blockChain)

    routes.post('/block', checkBody, blockController.postBlock)
    routes.get('/block/:height', blockController.getBlockByHeight)
    routes.get('*', (req, res, next) => next(new Error('404')))

    return routes
}

/**
* Validation function for Express-Validator middleware.
*
* @param  {Request} req Express request instance
* @param  {Response} res Express response instance
* @param  {Function} next Express middleware
*/
function checkBody(req, res, next) {
    req.check('body', 'Body is required').notEmpty()

    const errors = req.validationErrors()

    if (errors) {
        const err = new Error('422')

        err.errors = errors.map(v => v.msg)

        next(err)
    } else {
        next()
    }
}

module.exports = getRoutes
