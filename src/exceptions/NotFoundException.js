const Exception = require('./Exception')

/**
 * Exception used for specific "not found" cases such as blocks, resources, etc.
 */
class NotFoundException extends Exception {
    /**
     * Constructor function for NotFoundException. Extends Exception with
     * default message.
     *
     * @param  {String} message    the optional error message
     * @param  {String} name       the optional error name
     * @param  {String} lineNumber the optional line number
     */
    constructor(message = 'resource not found', name, lineNumber) {
        super(message, name, lineNumber)
    }
}

module.exports = NotFoundException
