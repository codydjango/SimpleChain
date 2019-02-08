const Blockchain = require('models/Blockchain')

// Export singleton -- we only ever want one blockchain.
let instance = undefined
module.exports = ((...args) => {
    if (instance) return instance
    return instance = new Blockchain(...args)
})()
