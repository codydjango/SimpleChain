const bitcoinMessage = require('bitcoinjs-message')
const ValidationException = require('exceptions/ValidationException')
const ValidationRequest = require('models/ValidationRequest')

/**
 * Mempool class
 */
class Mempool {
    /**
     * Constructor method for mempool
     */
    constructor() {
        this.timeouts = {}
        this.pending = {}
        this.permitted = {}
    }

    /**
     * Create a new validation request if it doesn't yet exist in the mempool.
     * If it does, update the validation window and return it.
     *
     * @param {String} address the wallet address
     * @return {ValidationRequest} a validationRequest instance
     */
    addValidationRequest(address) {
        const validationRequest = this.getOrCreateValidationRequest(address)

        validationRequest.updateValidationWindow()

        return validationRequest
    }

    /**
     * Get the validationRequest from the memPool or create a new one and store it in the memPool.
     * Set a timer to remove it from the mempool if it is not verified within the allotted window.

     * @param  {String} address the wallet address
     * @return {ValidationRequest} the ValidationRequest instance
     */
    getOrCreateValidationRequest(address) {
        if (!this.pending[address]) {
            this.pending[address] = ValidationRequest.create(address)
            this.timeouts[address] = setTimeout(() => delete this.timeouts[address], ValidationRequest.WINDOW_TIME)
        }

        return this.pending[address]
    }

    /**
     * Method for validating ownership of a validationRequest in the mempool.
     *
     * @param {String} address the wallet address
     * @param {String} digital signature of the message for the address
     * @throws {ValidationException} if no  validationRequest in the mempool or if signature is invalid
     * @return {[type]} [description]
     */
    validateValidationRequest(address, signature) {
        if (!this.pending[address]) throw new ValidationException('No validation request for this address in Mempool')
        if (!bitcoinMessage.verify(this.pending[address].message, address, signature)) throw new ValidationException('Signature not valid')

        this.permitted[address] = this.pending[address].sign()
        delete this.pending[address]

        return {
            registerStar: true,
            status: this.permitted[address]
        }
    }

    isPermitted(address) {
        return (this.permitted[address])
    }

    removePermission(address) {
        delete this.permitted[address]
    }
}

// Export singleton -- we only ever want one mempool.
let instance = undefined
module.exports = (() => {
    if (instance) return instance
    return instance = new Mempool()
})()
