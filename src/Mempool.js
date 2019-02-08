const REGISTRY = 'starRegistry'
const WINDOW_TIME = 1000 * 60 * 5

/**
 * ValidationRequest class
 */
class ValidationRequest {
    /**
     * Static factory method for creating new instances.
     *
     * @param  {String} walletAddress
     * @return {ValidationRequest} the newly created ValidationRequest instance
     */
    static create(walletAddress) {
        return new this(walletAddress)
    }

    /**
     * Constructor method for ValidationRequest.
     *
     * @param  {String} walletAddress
\     */
    constructor(walletAddress) {
        this.walletAddress = walletAddress
        this.requestTimeStamp = +new Date()
        this.message = `${this.walletAddress}:${this.requestTimestamp}.${this.getRegistry()}`
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
     */
    updateValidationWindow() {
        this.validationWindow = Math.floor((WINDOW_TIME - (+new Date() - this.requestTimeStamp)) / 1000)
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
        this.pool = []
        this.timeoutRequests = {}
        this.mempoolValid = []
    }

    /**
     * Create a new ValidationRequest if it doesn't yet exist in the mempool.
     * If it does, update the validation window and return it.
     *
     * @param {String} walletAddress
     */
    addValidationRequest(walletAddress) {
        const request = this.getOrCreateValidationRequest(walletAddress)

        request.updateValidationWindow(request)

        return request
    }

    /**
     * Get the ValidationRequest from the memPool or create a new one and store it in the memPool.
     * Set a timer to remove it from the mempool if it is not verified within the allotted window.

     * @param  {String} walletAddress
     * @return {ValidationRequest} the ValidationRequest object
     */
    getOrCreateValidationRequest(walletAddress) {
        if (!this.pool[walletAddress]) {
            this.pool[walletAddress] = ValidationRequest.create(walletAddress)
            this.timeoutRequests[walletAddress] = setTimeout(() => delete self.timeoutRequests[walletAddress], WINDOW_TIME)
        }

        return this.pool[walletAddress]
    }
}

// Export singleton -- we only ever want one mempool.
let instance = undefined
module.exports = function(...args) {
    if (instance) return instance
    return instance = new Mempool(...args)
}
