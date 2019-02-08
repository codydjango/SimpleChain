const Mempool = require('models/Mempool')

// Export singleton -- we only ever want one mempool.
let instance = undefined
module.exports = ((...args) => {
    if (instance) return instance
    return instance = new Mempool(...args)
})()
