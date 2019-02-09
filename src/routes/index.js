const express = require('express')
const notary = require('controllers/Notary')
const { starValidation, handleStarValidation, handlePermittedRequest } = require('middleware')
const routes = express.Router()

routes.post('/requestValidation', notary.request)
routes.post('/message-signature/validate', notary.validate)
routes.post('/block', starValidation, handleStarValidation, handlePermittedRequest, notary.register)
// routes.get('/block/:height', blockController.getBlockByHeight)
routes.get('*', (req, res, next) => next(new NotFoundException()))

module.exports = routes
