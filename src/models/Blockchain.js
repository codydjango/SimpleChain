const NotFoundException = require('exceptions/NotFoundException')
const Store = require('models/Store')
const Block = require('models/Block')

/**
 * Blockchain class
 */
class Blockchain {
    /**
     * Constructor for the Blockchain instance.
     * @param  {Boolean} whether or not to reset the database, defaults to false
     */
    constructor(reset = false) {
        this.store = new Store()
    }

    /**
     * Wait until async operations are done before notifying system that
     * the blockchain is ready for use. If the reset flag was set to true
     * during instantiation, empty the store.
     *
     * @return {Promise<true>}
     */
    async onReady(reset = false) {
        if (reset) return await this.store.empty()

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
     * @throws {NotFoundException} if no block is found in the database
     */
    async getBestBlock() {
        const height = await this.getBlockHeight()

        if (height === 0) throw new NotFoundException()

        const block = await this.getBlock(height - 1)

        return block
    }

    /**
     * Get a block at a specific height.
     *
     * @param  {Integer} the height of the block
     * @return {Promise<Block>} a promise resolving to the block
     * @throws {NotFoundException} if block doesn't exist at the given height
     */
    async getBlock(height) {
        try {
            return Block.fromString(await this.store.get(height))
        } catch (err) {
            throw new NotFoundException()
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
            if (!err instanceof BlockNotFoundException) throw err
            bestBlock = await this.createGenesisBlock()
        }

        block.previousBlockHash = bestBlock.hash
        block.height = bestBlock.height + 1
        block.time = Block.getTimestamp()
        block.hash = Block.calculateHash(block)

        await this.store.add(block.height, block.toString())

        return block.decodeStory()
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
}

module.exports = Blockchain
