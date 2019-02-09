const bitcoinMessage = require('bitcoinjs-message')
const ValidationException = require('exceptions/ValidationException')
const Transaction = require('models/Transaction')

/**
 * Mempool class
 */
class Mempool {
    /**
     * Constructor method for mempool
     */
    constructor() {
        this.timeouts = {}
        this.transactions = {}
        this.permitted = {}
    }

    /**
     * Create a new transaction if it doesn't yet exist in the mempool.
     * If it does, update the validation window and return it.
     *
     * @param {String} address the wallet address
     * @return {Transaction} a transaction instance
     */
    addTransactionRequest(address) {
        const transaction = this.getOrCreateTransaction(address)

        transaction.updateValidationWindow()

        return transaction
    }

    /**
     * Get the transaction from the memPool or create a new one and store it in the memPool.
     * Set a timer to remove it from the mempool if it is not verified within the allotted window.

     * @param  {String} address the wallet address
     * @return {Transaction} the Transaction instance
     */
    getOrCreateTransaction(address) {
        if (!this.transactions[address]) {
            this.transactions[address] = Transaction.create(address)
            this.timeouts[address] = setTimeout(() => delete this.timeouts[address], Transaction.WINDOW_TIME)
        }

        return this.transactions[address]
    }

    /**
     * Method for validating ownership of a transaction in the mempool.
     *
     * @param {String} address the wallet address
     * @param {String} digital signature of the message for the address
     * @throws {ValidationException} if no  transaction in the mempool or if signature is invalid
     * @return {[type]} [description]
     */
    validateTransaction(address, signature) {
        if (!this.transactions[address]) throw new ValidationException('No transaction for this address in Mempool')
        if (!bitcoinMessage.verify(this.transactions[address].message, address, signature)) throw new ValidationException('Signature not valid')

        this.permitted[address] = this.transactions[address].sign()
        delete this.transactions[address]

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
