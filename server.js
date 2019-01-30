const express = require('express')
const app = express()
const port = 8000
const router = express.Router()
const bodyParser = require('body-parser')

router.get('/', (req, res) => {
    res.json('Hello World!')
})

app.use(bodyParser.json())
app.use(router)
app.listen(port, listening)

function listening() {
	console.log(`API listening on localhost:${port}`)
}
