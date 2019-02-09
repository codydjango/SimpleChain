const WINDOW_TIME = 1000 * 60 * 5
const REGISTRY = 'starRegistry'

/**
 * ValidationRequest class
 */
class ValidationRequest {
    /**
     * Static factory method for creating new instances.
     *
     * @param  {String} address the wallet address
     * @return {ValidationRequest} the newly created ValidationRequest instance
     */
    static create(address) {
        return new ValidationRequest(address)
    }

    /**
     * Static getter for setting of window length.
     *
     * @param  {Integer} the window time in ms
     */
    static get WINDOW_TIME() {
        return WINDOW_TIME
    }

    /**
     * Static getter for setting of registry.
     *
     * @param  {String} the name of the registry.
     */
    static get REGISTRY() {
        return REGISTRY
    }

    /**
     * Constructor method for ValidationRequest.
     *
     * @param  {String} address the wallet address
\     */
    constructor(address) {
        this.address = address
        this.timestamp = +new Date()
        this.messageSignature = false
        this.message = `${ this.address }:${ this.timestamp }.${ ValidationRequest.REGISTRY }`
    }

    /**
     * Update the validation window.
     *
     * @return {ValidationRequest} itself for easy chaining.
     */
    updateValidationWindow() {
        this.validationWindow = Math.floor((ValidationRequest.WINDOW_TIME - (+new Date() - this.timestamp)) / 1000)

        return this
    }

    /**
     * The signature is valid and the user can register.
     *
     * @return {ValidationRequest} itself for easy chaining
     */
    sign() {
        this.messageSignature = true
        delete this.validationWindow

        return this
    }

    /**
     * The signature is valid and the user can register.
     *
     * @return {Boolean} if the message is signed or not
     */
    isSigned() {
        return (this.messageSignature = true)
    }
}


module.exports = ValidationRequest
