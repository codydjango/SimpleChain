const Store = require('./Store')
const Block = require('./Block')

/**
 * Blockchain class
 */
class Blockchain {
    /**
     * Constructor for the Blockchain instance.
     * @param  {Boolean} whether or not to reset the database, defaults to false
     */
    constructor(reset = false) {
        this.reset = reset
        this.store = new Store()
    }

    /**
     * Wait until async operations are done before notifying system that
     * the blockchain is ready for use. If the reset flag was set to true
     * during instantiation, empty the store.
     *
     * @return {Promise<true>}
     */
    async onReady() {
        if (this.reset) return await this.store.empty()

        return true
    }

    /**
     * Create the first block with special properties (height of zero and
     * no previous parent hash) and persist the block in the database.
     *
     * @return {Promise<Block>} a promise resolving to the block
     */
    async createGenesisBlock() {
        const block = Block.first()

        await this.store.add(block.height, block.toString())

        return block
    }

    /**
     * Get the most recent block.
     *
     * @return {Promise<Block>} a promise resolving to the block
     * @throws {Error} if no block is found in the database
     */
    async getBestBlock() {
        const height = await this.getBlockHeight()

        if (height === 0) throw new Error('No best block')

        const block = await this.getBlock(height - 1)

        return block
    }

    /**
     * Get a block at a specific height.
     *
     * @param  {Integer} the height of the block
     * @return {Promise<Block>} a promise resolving to the block
     * @throws {Error} if block doesn't exist at the given height
     */
    async getBlock(height) {
        try {
            const str = await this.store.get(height)
            return Block.fromString(str)
        } catch (err) {
            throw new Error('block not found')
        }
    }

    /**
     * Get the height of the blockchain.
     *
     * @return {Promise<Integer>} a promise resolving to the height
     */
    async getBlockHeight() {
        return await this.store.currentHeight()
    }

    /**
     * Prepare the block to be added to the chain, and persist the
     * block in the database.
     *
     * @param {Promise<Block>} a promise resolving to the block
     */
    async addBlock(block) {
        let bestBlock

        try {
            bestBlock = await this.getBestBlock()
        } catch (err) {
            if (err.message !== 'No best block') throw err
            bestBlock = await this.createGenesisBlock()
        }

        block.previousBlockHash = bestBlock.hash
        block.height = bestBlock.height + 1
        block.time = Block.getTimestamp()
        block.hash = Block.calculateHash(block)

        await this.store.add(block.height, block.toString())

        return block
    }

    /**
     * Validate a block at a given height.
     *
     * @param  {Integer} height of the block to be validated
     * @return {Promise<Boolean>} a promise resolving to the validity of the block
     */
    async validateBlock(height) {
        const block = await this.getBlock(height)

        return block.isValid()
    }

    /**
     * Validate the entire chain.
     *
     * @return {Promise<Array>} a promise resolving to an array of invalid blocks
     */
    async validateChain() {
        const chainHeight = await this.getBlockHeight()
        const promises = [...Array(chainHeight).keys()].map(async height => this.getBlock(height))
        const blocks = await Promise.all(promises)

        return blocks.filter(block => !block.isValid())
    }

    /**
     * A test method used for replacing a block.
     *
     * @param  {Integer} the height of the block to modify
     * @param  {Block} the replacement block
     * @return {Promise<Block>} a promise resolving to the replacement block
     */
    async _modifyBlock(height, replacementBlock) {
        await this.store.add(height, replacementBlock.toString())

        return replacementBlock
    }
}

// Export singleton -- we only ever want one mempool.
let instance = undefined
module.exports = function(...args) {
    if (instance) return instance
    return instance = new Blockchain(...args)
}
