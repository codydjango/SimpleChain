const starValidation = require('middleware/starValidation')
const handleStarValidation = require('middleware/handleStarValidation')
const handlePermittedRequest = require('middleware/handlePermittedRequest')
const errorHandler = require('middleware/errorHandler')

module.exports = {
    starValidation,
    handleStarValidation,
    handlePermittedRequest,
    errorHandler
}
