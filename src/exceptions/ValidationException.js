const Exception = require('exceptions/Exception')

/**
 * Exception used for specific validation failures.
 */
class ValidationException extends Exception {
    /**
     * Constructor function for ValidationException. Extends Exception with
     * default message and 'data' argument useful for debugging or presenting
     * form invalidation back to the client.
     *
     * @param  {String} message    the optional error message
     * @param  {String} data       the optional error data
     * @param  {String} name       the optional error name
     * @param  {String} lineNumber the optional line number
     */
    constructor(message = 'fails validation', data = {}, name, lineNumber) {
        super(message, name, lineNumber)
        this.data = data
    }
}

module.exports = ValidationException
