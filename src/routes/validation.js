const express = require('express')
const ValidationController = require('../controllers/Validation')

module.exports = () => {
    const routes = express.Router()
    const validationController = new ValidationController()

    routes.post('/requestValidation', validationController.request)
    routes.post('/message-signature/validate', validationController.validate)

    return routes
}
