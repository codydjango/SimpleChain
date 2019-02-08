const express = require('express')
const blockRoutes = require('./block')
const validationRoutes = require('./validation')

/**
* Utility factory function for Express router.
* @param  {BlockChain} blockChain instance
* @return {Router} the express router
*/
module.exports = (blockChain) => {
    const routes = express.Router()

    routes.use(blockRoutes(blockChain))
    routes.use(validationRoutes())
    routes.get('*', (req, res, next) => next(new Error('404')))

    return routes
}
