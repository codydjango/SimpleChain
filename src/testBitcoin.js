const bitcoin = require('bitcoinjs-lib')
const bitcoinMessage = require('bitcoinjs-message')
const output = require('utilities/output')

;(function testVerify() {
    output('test bitcoin verify', 'blue')
    const address = '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ'
    const signature = 'IJtpSFiOJrw/xYeucFxsHvIRFJ85YSGP8S1AEZxM4/obS3xr9iz7H0ffD7aM2vugrRaCi/zxaPtkflNzt5ykbc0='
    const message = '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532330740:starRegistry'

    console.log(bitcoinMessage.verify(message, address, signature))
})()
