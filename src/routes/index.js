const express = require('express')
const NotaryController = require('../controllers/Notary')
const memPool = require('../mempool')

const routes = express.Router()
const controller = new NotaryController()

routes.post('/requestValidation', controller.request)
routes.post('/message-signature/validate', controller.validate)
routes.post('/block', validateBody, validateRequest, controller.register)
// routes.get('/block/:height', blockController.getBlockByHeight)
// routes.get('*', (req, res, next) => next(new Error('404')))



/**
* Validation function for Express-Validator middleware.
*
* @param  {Request} req Express request instance
* @param  {Response} res Express response instance
* @param  {Function} next Express middleware
*/
function validateBody(req, res, next) {
    req.check('address', 'Address is required').notEmpty()
    req.check('star', 'Star data is required').notEmpty()

    const errors = req.validationErrors()

    if (errors) {
        const err = new Error('422')

        err.errors = errors.map(v => v.msg)

        next(err)
    } else {
        next()
    }
}

/**
 * Validation on whether a signed validationRequest exists in the mempool.
 *
 * @param  {Request} req Express request instance
 * @param  {Response} res Express response instance
 * @param  {Function} next Express middleware
 */
function validateRequest(req, res, next) {
    if (!memPool.isSigned(req.address)) next(new Error('422'))
}

module.exports = routes
