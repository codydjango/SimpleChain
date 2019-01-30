const express = require('express')
const bodyParser = require('body-parser')
const BlockChain = require('./BlockChain.js')
const Block = require('./Block.js')

const app = express()
const port = 8000
const router = express.Router()
const myBlockChain = new BlockChain()

const listening = () => console.log(`API listening on localhost:${port}`)
const http404 = (req, res) => res.status(404).json({ status: 'not found' })

router.get('/block/:height', getBlockByHeight)
router.get('*', http404)

;(async () => {
    await myBlockChain.onReady()

    app.use(bodyParser.json())
    app.use(router)
    app.listen(port, listening)
})()


async function getBlockByHeight(req, res) {
    try {
        const block = await myBlockChain.getBlock(req.params.height)
        res.json(block)
    } catch (err) {
        http404(req, res)
    }
}
