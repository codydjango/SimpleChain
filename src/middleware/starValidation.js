const { check } = require('express-validator/check')
const VALID_ATTRIBUTES = ['ra', 'dec', 'cen', 'mag', 'story']

module.exports = [
    check('address', 'Address is required').exists(),
    check('star', 'Star data is required').exists(),
    check('star', `Star data must only contain following attributes: ${ VALID_ATTRIBUTES.join(', ') }`)
        .custom(star => Object.keys(star).filter(key => VALID_ATTRIBUTES.indexOf(key) === -1).length === 0)
]
