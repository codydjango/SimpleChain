const mempool = require('services/mempool')
const blockchain = require('services/blockchain')
const Block = require('models/Block')

/**
 * Express Controller for Notary service.
 */
class NotaryController {
    /**
     * Constructor for the BlockController class.
     */
    constructor() {
        this.request = this.request.bind(this)
        this.validate = this.validate.bind(this)
    }

    /**
     * User create a transaction request.
     *
     * @param  {Request} req Express request instance
     * @param  {Response} res Express response instance
     * @param  {Function} next Express middleware
     */
    async request(req, res, next) {
        try {
            res.json(mempool.addTransactionRequest(req.body.address))
        } catch (err) {
            return next(err)
        }
    }

    /**
     * User sends back the message with an address and signature proving
     * they are the owner of that address.
     *
     * @param  {Request} req Express request instance
     * @param  {Response} res Express response instance
     * @param  {Function} next Express middleware
     */
    async validate(req, res, next) {
        try {
            res.json(mempool.validateTransaction(req.body.address, req.body.signature))
        } catch (err) {
            return next(err)
        }
    }

    /**
     * User can now register a star. If the user has provided a story, store it as hex.
     *
     * @param  {Request} req Express request instance
     * @param  {Response} res Express response instance
     * @param  {Function} next Express middleware
     */
    async register(req, res, next) {
        let block
        let star = req.body.star

        if (star.story) star.story = Buffer.from(star.story).toString('hex')

        const body = {
            address: req.body.address,
            star: star
        }

        try {
            block = await Block.create(body)
            block = await blockchain.addBlock(block)

            mempool.removePermission(body.address)

            res.json(block.decodeStory())
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new NotaryController()
