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
     * User create a validation request.
     *
     * @param  {Request} req Express request instance
     * @param  {Response} res Express response instance
     * @param  {Function} next Express middleware
     */
    async request(req, res, next) {
        try {
            res.json(this.memPool.addValidationRequest(req.body.address))
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
            res.json(this.memPool.validateRequestByWallet(req.body.address, req.body.signature))
        } catch (err) {
            return next(err)
        }
    }
}

module.exports = ValidationController
