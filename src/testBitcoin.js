const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');
const Mempool = require('./Mempool')
const output = require('./output')

;(function testVerify() {
    output('test 1', 'blue')
    const address = '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ'
    const signature = 'IJtpSFiOJrw/xYeucFxsHvIRFJ85YSGP8S1AEZxM4/obS3xr9iz7H0ffD7aM2vugrRaCi/zxaPtkflNzt5ykbc0='
    const message = '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532330740:starRegistry'

    console.log(bitcoinMessage.verify(message, address, signature))
})()


;(function testMempoolSingletonWithNew() {
    output('test 2', 'blue')
    const mempool1 = new Mempool()
    const mempool2 = new Mempool()

    mempool1.good = 'bad'

    console.log(mempool1.good === mempool2.good)

    mempool2.good = 'bad'

    console.log(mempool1.good === mempool2.good)
})()


;(function testMempoolSingleton() {
    output('test 3', 'blue')
    const getMemPool = Mempool

    const mempool1 = getMemPool()
    const mempool2 = getMemPool()

    mempool1.good = 'bad'

    console.log(mempool1.good === mempool2.good)

    mempool2.good = 'bad'

    console.log(mempool1.good === mempool2.good)
})()


;(function testMempoolSingleton() {
    output('test 4', 'blue')
    const mempool = Mempool()

    console.log(mempool.addRequest('asdfasdfqwerqwerewq'))
})()
