const memPool = require('../mempool')
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
            res.json(memPool.addValidationRequest(req.body.address))
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
            res.json(memPool.validateRequestByWallet(req.body.address, req.body.signature))
        } catch (err) {
            return next(err)
        }
    }

    /**
     * User can now register something.
     *
     * @param  {Request} req Express request instance
     * @param  {Response} res Express response instance
     * @param  {Function} next Express middleware
     */
    async register(req, res, next) {
        let block

        const body = {
            address: req.body.address,
            star: clean(req.body.star)
        }

        try {
            block = await Block.create(body)
            block = await blockChain.addBlock(block)

            if (block.star.story) block.star.storyDecoded = fromHex(block.star.story)

            res.json(block)
        } catch (err) {
            next(err)
        }
    }
}

/**
 * A method for sanitizing the star data before sending it to the blockchain.
 * This includes hex-encoding the star story.
 *
 * @param  {obj} star the star object
 * @return {obj} a cleaned new star
 */
function clean(star) {
    const validKeys = ['ra', 'dec', 'cen', 'mag', 'story']
    const cleaned = {}

    for (let key in star) {
        if (validKeys.indexOf(key) != -1) {
            cleaned[key] = star[key]
        }
    }

    if (star.story) cleaned.story = Buffer.from(star.story).toString('hex')

    return cleaned
}


/**
 * Utility method for converting from hex back to ascii.
 *
 * @param  {String} str the hex string
 * @return {String} the ascii string
 */
function fromHex(str) {
    let result = ''

    for (let i = 0; i < str.length; i += 2) {
        result += String.fromCharCode(parseInt(str.substr(i, 2), 16));
    }

    return result
}

module.exports = NotaryController
