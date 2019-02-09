const { validationResult } = require('express-validator/check')
const ValidationException = require('exceptions/ValidationException')

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

module.exports = handleStarValidation
