const bitcoinMessage = require('bitcoinjs-message');

const REGISTRY = 'starRegistry'
const WINDOW_TIME = 1000 * 60 * 5

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
        return new this(address)
    }

    /**
     * Constructor method for ValidationRequest.
     *
     * @param  {String} address the wallet address
\     */
    constructor(address) {
        this.address = address
        this.timestamp = +new Date()
        this.message = `${ this.address }:${ this.timestamp }.${ this.getRegistry() }`
        this.messageSignature = false
    }

    /**
     * Return the registry type.
     *
     * @return {String} the registry type
     */
    getRegistry() {
        return REGISTRY
    }

    /**
     * Update the validation window.
     *
     * @return {ValidationRequest} itself for easy chaining.
     */
    updateValidationWindow() {
        this.validationWindow = Math.floor((WINDOW_TIME - (+new Date() - this.timestamp)) / 1000)

        return this
    }

    /**
     * The signature is valid and the user can register.
     *
     * @return {ValidationRequest} itself for easy chaining
     */
    sign() {
        this.messageSignature = true

        return this
    }

    /**
     * The signature is valid and the user can register.
     *
     * @return {ValidationRequest} itself for easy chaining
     */
    isSigned() {
        return (this.messageSignature = true)
    }
}


/**
 * Mempool class
 */
class Mempool {
    /**
     * Constructor method for mempool
     */
    constructor() {
        this.timeouts = {}
        this.requests = {}
        this.permitted = {}
    }

    /**
     * Create a new ValidationRequest if it doesn't yet exist in the mempool.
     * If it does, update the validation window and return it.
     *
     * @param {String} address the wallet address
     * @return {ValidationRequest} a validationRequest instance
     */
    addValidationRequest(address) {
        const request = this.getOrCreateValidationRequest(address)

        request.updateValidationWindow(request)

        return request
    }

    /**
     * Get the ValidationRequest from the memPool or create a new one and store it in the memPool.
     * Set a timer to remove it from the mempool if it is not verified within the allotted window.

     * @param  {String} address the wallet address
     * @return {ValidationRequest} the ValidationRequest object
     */
    getOrCreateValidationRequest(address) {
        if (!this.requests[address]) {
            this.requests[address] = ValidationRequest.create(address)
            this.timeouts[address] = setTimeout(() => delete self.timeouts[address], WINDOW_TIME)
        }

        return this.requests[address]
    }

    /**
     * Method for validating a pending ValidationRequest.
     *
     * @param {String} address the wallet address
     * @param {String} signature
     * @return {[type]} [description]
     */
    validateRequestByWallet(address, signature) {
        if (!this.requests[address]) throw new Error('422')
        if (!bitcoinMessage.verify(this.requests[address].message, address, signature)) throw new Error('422')

        this.permitted[address] = this.requests[address].sign()
        delete this.requests[address]

        return {
            registerStar: true,
            status: this.permitted[address]
        }
    }

    isPermitted(address) {
        return (this.permitted[address])
    }
}

// Export singleton -- we only ever want one mempool.
let instance = undefined
module.exports = ((...args) => {
    if (instance) return instance
    return instance = new Mempool(...args)
})()
