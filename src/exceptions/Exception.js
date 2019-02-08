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

module.exports = Exception
