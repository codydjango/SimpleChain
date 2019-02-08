/**
 * Simple function for outputting colored text to stdout using console.log.
 *
 * @param  {String} msg the string to print
 * @param  {String} color either red, green, or blue. Default is reset.
 */
function output(msg, color='reset') {
    const colors = {
        reset: '\x1b[0m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        blue: '\x1b[34m'
    }

    if (!colors[color]) throw new Error('Only red green and blue are supported.')

    console.log(`${colors[color]}${msg}${colors['reset']}`)
}

module.exports = output
