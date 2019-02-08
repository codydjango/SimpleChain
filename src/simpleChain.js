/**
 * Executable Test
 *
 * This file is used to test this project.
 *
 * Please note:
 * 		I've placed all test code within an "async" closure
 * 		so I can benefit from the "await" syntax, which I prefer.
 *
 * 		I've also separated each "test" in it's own function
 * 		expression, so I can benefit from function closures.
 */

const BlockChain = require('./BlockChain')
const Block = require('./Block')
const output = require('./output')
const RESET = true
const myBlockChain = new BlockChain(RESET)


;(async function () {
	output('Welcome to my blockchain!', 'blue')

	await myBlockChain.onReady()
	await createTestBlocks()

	//////////////////////////////
	// TEST GET HEIGHT OF CHAIN //
	//////////////////////////////
	await (async function () {
		output('1) Get Height of Chain', 'blue')
		const height = await myBlockChain.getBlockHeight()
		output(`height: ${height}`)
	})()


	/////////////////////////////
	// TEST GET BLOCK IN CHAIN //
	/////////////////////////////
	await (async function () {
		output('2) Get Genesis Block', 'blue')
		const block = await myBlockChain.getBlock(0)
		output(`Genesis block: ${JSON.stringify(block)}`)
	})()


	///////////////////////////
	// TEST BLOCK VALIDATION //
	///////////////////////////
	await (async function () {
		output('3) Validate Blocks', 'blue')
		const valid1 = await myBlockChain.validateBlock(0)
		output(`Genesis block is valid: ${valid1}`)

		/** Tampering a Block: this is for the purpose of testing the validation methods */
		const block5 = await myBlockChain.getBlock(5)
		block5.body = 'Tampered Block'

		await myBlockChain._modifyBlock(block5.height, block5)
		output(`Block #${block5.height} was modified`)
		const valid2 = await myBlockChain.validateBlock(block5.height)
		output(`Block #${block5.height} is valid: ${valid2}`)

		const block6 = await myBlockChain.getBlock(6)
		block6.previousBlockHash = 'jndininuud94j9i3j49dij9ijij39idj9oi'

		await myBlockChain._modifyBlock(block6.height, block6)
		output(`Block #${block6.height} was modified`)
		output(`Block #${block6.height} is valid: ${valid2}`)
	})()


	///////////////////////////
	// TEST CHAIN VALIDATION //
	///////////////////////////
	await (async function () {
		output('4) Validate Chain', 'blue')
		const errorBlocks = await myBlockChain.validateChain()

		if (errorBlocks.length > 0) {
			output('The chain is not valid')
			errorBlocks.forEach(block => output(`Block #${block.height} is not valid`))
		} else {
			output('No errors found, The chain is valid!')
		}
	})()
})()



//////////////////////
// UTILITY HELPERS  //
//////////////////////

/**
 * Creating 10 test blocks in sequence.
 *
 * @return {Promise<bool>} a promise of there it was successful or not.
 */
function createTestBlocks() {
	output('Creating test blocks...', 'red')
	return new Promise((resolve, reject) => {
		;(async function theLoop (i) {
			const result = await myBlockChain.addBlock(Block.create(`Test Block - ${i + 1}`))
			output(`Created block #${result.height} ${result.hash}`, 'red')
			i++; (i < 10) ? theLoop(i) : resolve(true)
		})(0)
	})
}
