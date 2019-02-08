const mempool = require('../mempool')
const blockchain = require('../blockchain')
const Block = require('../Block')

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
     * User create a validation request.
     *
     * @param  {Request} req Express request instance
     * @param  {Response} res Express response instance
     * @param  {Function} next Express middleware
     */
    async request(req, res, next) {
        try {
            res.json(mempool.addValidationRequest(req.body.address))
        } catch (err) {
            return next(err)
        }
    }

    /**
     * User sends back the message with an address and signature.
     *
     * @param  {Request} req Express request instance
     * @param  {Response} res Express response instance
     * @param  {Function} next Express middleware
     */
    async validate(req, res, next) {
        try {
            res.json(mempool.validateRequestByWallet(req.body.address, req.body.signature))
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

        const body = {
            address: req.body.address,
            star: req.body.star
        }

        if (star.story) star.story = Buffer.from(star.story).toString('hex')

        try {
            block = await Block.create(body)
            block = await blockchain.addBlock(block)

            mempool.removePermission(body.address)

            res.json(block)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = NotaryController
