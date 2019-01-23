const level = require('level')
const CHAINDATA = './chaindata'

/**
 * Store class
 *
 * A simple class to encapulate levelDB operations.
 */
class Store {
    /**
     * Constructor for Store
     */
    constructor() {
        this.db = level(CHAINDATA)
    }

    /**
     * Get an item from LevelDb
     * 
     * @param  {Integer} the height of the block 
     * @return {Promise<String>} promise resolving to the value
     */
    get(key) {
        return new Promise((resolve, reject) => this.db.get(key, (err, value) => (err) ? reject(err) : resolve(value)))
    }

    /**
     * Add a new item to LevelDb
     * 
     * @param {String} key
     * @param {String} value
     * @return {Promise<String>} promise resolving to the value
     */
    add(key, value) {
        return new Promise((resolve, reject) => this.db.put(key, value, err => (err) ? reject(err) : resolve(value)))
    }

    /**
     * Get the "height" of the database. This is equal to the count of all keys
     * 
     * @return {Promise<Integer>} promise resolving to an integer representing the height.
     */
    currentHeight() {
        let i = 0;
        return new Promise((resolve, reject) => this.db.createReadStream({ keys: true, values: true })
            .on('data', (d) => i++)
            .on('error', err => reject(err))
            .on('close', () => resolve(i)))
    }

    /**
     * Utility method returning all keys in the database.
     * 
     * @return {Promise<Array>} promise resolving to an array of all database keys.
     */
    keys() {
        const keys = []
        return new Promise((resolve, reject) => this.db.createReadStream({ keys: true, values: false })
            .on('data', (d) => keys.push(d))
            .on('error', err => reject(err))
            .on('close', () => resolve(keys)))
    }

    /**
     * Utility method for emptying all items from the database. Useful for development.
     * 
     * @return {Promise<Boolean>} promise resolving to true.
     */
    empty() {
        return new Promise((resolve, reject) => {
            this.keys().then(keys => {
                this.db.batch(keys.map(x => ({ 'type': 'del', 'key': '' + x })), (err) => (err) ? reject(err) : resolve(true))
            })
        })
    }
}

module.exports = Store
