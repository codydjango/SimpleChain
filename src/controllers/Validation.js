const getMempool = require('../Mempool')

/**
 * Express Controller for Validation endpoints.
 */
class ValidationController {
    /**
     * Constructor for the BlockController class. Instantiate with the
     * ready blockchain and bind the controller methods.
     *
     * @param  {BlockChain} blockChain instance
     */
    constructor() {
        this.memPool = getMempool()
        this.request = this.request.bind(this)
        this.validate = this.validate.bind(this)
    }

    /**
     * Controller method for getting a block by height.
     *
     * @param  {Request} req Express request instance
     * @param  {Response} res Express response instance
     * @param  {Function} next Express middleware
     */
    async request(req, res, next) {
        const request = this.memPool.addValidationRequest(req.body.address)

        console.log('request', request)

        res.json(request)
    }

    async validate(req, res, next) {
        const address = req.address
        const signature = req.signature
        this.mempool.validateRequestByWallet(message, address, signature)
    }

    async claim(req, res, next) {
        this.mempool.claim({
            address: req.address,
            star: req.star
        })
    }
}

module.exports = ValidationController
