const express = require('express')
const notary = require('controllers/Notary')
const NotFoundException = require('exceptions/NotFoundException')
const { starValidation, handleStarValidation, handlePermittedRequest } = require('middleware')
const routes = express.Router()

routes.post('/requestValidation', notary.request)
routes.post('/message-signature/validate', notary.validate)
routes.post('/block', starValidation, handleStarValidation, handlePermittedRequest, notary.register)
routes.get('/stars/:slug', notary.getStar)
routes.get('/block/:height', notary.getBlockByHeight)
routes.get('*', (req, res, next) => next(new NotFoundException()))

module.exports = routes
