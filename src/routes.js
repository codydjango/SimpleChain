const express = require('express')
const { check, validationResult } = require('express-validator/check')
const NotaryController = require('./controllers/Notary')
const mempool = require('./mempool')
const { NotFoundException, ValidationException } = require('./Exception')

const routes = express.Router()
const controller = new NotaryController()

routes.post('/requestValidation', controller.request)
routes.post('/message-signature/validate', controller.validate)
routes.post('/block', createStarValidation(), handleStarValidation, handlePermittedRequest, controller.register)
// routes.get('/block/:height', blockController.getBlockByHeight)
routes.get('*', (req, res, next) => next(new NotFoundException()))


/**
* Setup validators for Star data using express-validation.
*
* @return {Array} the array of checks to validate
*/
function createStarValidation() {
    const VALID_ATTRIBUTES = ['ra', 'dec', 'cen', 'mag', 'story']

    return [
        check('address', 'Address is required').exists(),
        check('star', 'Star data is required').exists(),
        check('star', `Star data must only contain following attributes: ${ VALID_ATTRIBUTES.join(', ') }`)
            .custom(star => Object.keys(star).filter(key => VALID_ATTRIBUTES.indexOf(key) === -1).length === 0)
    ]
}

/**
 * Handle the failed validation or proceed.
 *
 * @param  {Request} req Express request instance
 * @param  {Response} res Express response instance
 * @param  {Function} next Express middleware
 */
function handleStarValidation(req, res, next) {
    if (validationResult(req).isEmpty()) return next()

    next(new ValidationException('failed valiation', validationResult(req).array({ onlyFirstError: true }).map(v => v.msg)))
}

/**
 * Validation on whether a signed validationRequest exists in the mempool.
 *
 * @param  {Request} req Express request instance
 * @param  {Response} res Express response instance
 * @param  {Function} next Express middleware
 */
function handlePermittedRequest(req, res, next) {
    if (mempool.isPermitted(req.body.address)) return next()

    next(new ValidationException('not in mempool'))
}

module.exports = routes
