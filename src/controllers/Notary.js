const mempool = require('services/mempool')
const blockchain = require('services/blockchain')
const Block = require('models/Block')
const NotFoundException = require('exceptions/NotFoundException')

/**
 * Express Controller for Notary service.
 */
class NotaryController {
    /**
     * User create a validation request. POST endpoint.
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
     * User sends back the message with an address and signature proving
     * they are the owner of that address. POST endpoint.
     *
     * @param  {Request} req Express request instance
     * @param  {Response} res Express response instance
     * @param  {Function} next Express middleware
     */
    async validate(req, res, next) {
        try {
            res.json(mempool.validateValidationRequest(req.body.address, req.body.signature))
        } catch (err) {
            return next(err)
        }
    }

    /**
     * User can register a single star. If the user has provided a story,
     * store it as hex. POST endpoint.
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

            res.json(block)
        } catch (err) {
            next(err)
        }
    }

    /**
     * User can get a star by hash. GET endpoint.
     *
     * @param  {Request} req Express request instance
     * @param  {Response} res Express response instance
     * @param  {Function} next Express middleware
     */
    async getStar(req, res, next) {
        const [lookup, id] = req.params.slug.split(':')

        if (['hash', 'address'].indexOf(lookup) === -1) throw new NotFoundException()

        try {
            // silly logic here. The client is expecting a list for "address" lookups
            // and a single object for "hash" lookups.
            if (lookup === 'hash') {
                const block = await blockchain.getBlockByHash(id)
                res.json(block.decodeStory())
            } else {
                const blocks = await blockchain.getBlocksByAddress(id)
                res.json(blocks.map(block => block.decodeStory()))
            }
        } catch (err) {
            next(err)
        }
    }


    /**
     * User can get a block by height. GET endpoint.
     *
     * @param  {Request} req Express request instance
     * @param  {Response} res Express response instance
     * @param  {Function} next Express middleware
     */
    async getBlockByHeight(req, res, next) {
        try {
            const block = await blockchain.getBlockByHeight(req.params.height)
            res.json(block.decodeStory())
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new NotaryController()
