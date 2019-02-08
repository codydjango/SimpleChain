function ExtendableBuiltin(cls) {
    function ExtendableBuiltinInner(...args) {
        cls.apply(this, args)
    }

    ExtendableBuiltinInner.prototype = Object.create(cls.prototype)
    Object.setPrototypeOf(ExtendableBuiltinInner, cls)

    return ExtendableBuiltinInner
}

/**
 * Generic Exception class that extends native "Error". Can be used with 'instanceof' operator.
 */
class Exception extends ExtendableBuiltin(Error) {
    /**
     * Constructor function for an extendable Exception.
     * This exception has the same signature as a standard built-in Error
     *
     * @param  {String} message    the optional error message
     * @param  {String} name       the optional error name
     * @param  {String} lineNumber the optional line number
     */
    constructor(message, name, lineNumber) {
        super()

        this.message = ''
        this.name = ''
        this.lineNumber = ''

        if (message) this.message = message
        if (name) this.name = name
        if (lineNumber) this.lineNumber = lineNumber
    }
}

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

module.exports = { Exception, ValidationException, NotFoundException }
