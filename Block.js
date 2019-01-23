const SHA256 = require('crypto-js/sha256')

/**
 * Block class
 *
 * Some static utility methods.
 */
class Block {
	/**
	 * Utility method for calculating a block hash out of several block properties.
	 * 
	 * @param  {Block} block the block to generate a hash for
	 * @return {String}	the hash of the block
	 */
	static calculateHash(block) {
		return SHA256(JSON.stringify({
			previousBlockHash: block.previousBlockHash,
			timestamp: block.timestamp,
			body: block.body,
			height: block.height
		})).toString()
	}

	/**
	 * Utility method for returning a timestamp.
	 * 
	 * @return {String} the timestamp
	 */
	static getTimestamp() {
		return new Date().getTime().toString().slice(0, -3)
	}

	/**
	 * Factory utility method for creating a block from a string representation.
	 * @param  {String}	the stringified JSON representation
	 * @return {Block} the new block instance
	 */
	static fromString(str) {
		const block = new Block()

		const obj = JSON.parse(str)

		block.body = obj.body
		block.height = parseInt(obj.height)
		block.previousBlockHash = obj.previousBlockHash
		block.time = obj.time
		block.hash = obj.hash

		return block
	}

	/**
	 * Factory utility method for creating the genesis block.
	 * 
	 * @return {Block} the genesis block
	 */
	static first() {
		const block = new Block()

		block.body = 'genesis'
		block.height = 0
		block.previousBlockHash = ''
		block.time = Block.getTimestamp()
		block.hash = Block.calculateHash(block)

		return block
	}

	/**
	 * Factory utility method for creating a block.
	 * 
	 * @param  {String} the body of the block
	 * @return {Block} the new block instance
	 */
	static create(body) {
		const block = new Block()

		block.body = body

		return block
	}

	/**
	 * Constructor for the Block instance.
	 * 
	 * @param  {String} the body of the block
	 */
	constructor(body) {
		this.hash = "",
		this.height = 0,
		this.body = body,
		this.time = 0,
		this.previousBlockHash = ""
	}

	/**
	 * Method for validating the block.
	 * 
	 * @return {Boolean} whether the block is valid or not
	 */
	isValid() {
		return (this.hash === Block.calculateHash(this))
	}

	/**
	 * Get the stringified JSON representation of the block.
	 * 
	 * @return {String} the stringified JSON representation of a block
	 */
	toString() {
		return JSON.stringify(this).toString()
	}
}

module.exports = Block