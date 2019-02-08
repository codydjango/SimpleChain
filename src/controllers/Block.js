const blockchain require('../services/blockchain')
const Block = require('../models/Block')

/**
 * Express Controller for BlockChain endpoints.
 */
class BlockController {
    /**
     * Constructor for the BlockController class. Binds the controller methods.
     */
    constructor() {
        this.getBlockByHeight = this.getBlockByHeight.bind(this)
        this.postBlock = this.postBlock.bind(this)
    }
    /**
     * Controller method for getting a block by height.
     *
     * @param  {Request} req Express request instance
     * @param  {Response} res Express response instance
     * @param  {Function} next Express middleware
     */
    async getBlockByHeight(req, res, next) {
        let block

        try {
            block = await blockchain.getBlock(req.params.height)
            res.json(block)
        } catch (err) {
            if (err.message = 'block not found') return next(new Error('404'))
            return next(err)
        }
    }

    /**
     * Controller method for posting a block. Returns the block.
     *
     * @param  {Request} req Express request instance
     * @param  {Response} res Express response instance
     * @param  {Function} next Express middleware
     */
    async postBlock(req, res, next) {
        let block

        try {
            block = await Block.create(req.body.body)
            block = await blockchain.addBlock(block)
            res.json(block)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = BlockController
