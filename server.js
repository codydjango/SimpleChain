const express = require('express')
const bodyParser = require('body-parser')
const BlockChain = require('./BlockChain.js')
const Block = require('./Block.js')

const app = express()
const port = 8000
const router = express.Router()
const myBlockChain = new BlockChain()

router.get('/block/:height', getBlockByHeight)


;(async () => {
    await myBlockChain.onReady()

    app.use(bodyParser.json())
    app.use(router)
    app.listen(port, listening)
})()


async function getBlockByHeight(req, res) {
    const block = await myBlockChain.getBlock(req.params.height)

    res.json(block)
}


function listening() {
    console.log(`API listening on localhost:${port}`)
}
