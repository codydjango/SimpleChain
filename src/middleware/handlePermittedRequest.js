const mempool = require('services/mempool')
const ValidationException = require('exceptions/ValidationException')


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

module.exports = handlePermittedRequest
