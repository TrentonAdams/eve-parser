/**
 * This is a simple example command line eve parser.  Try running it from the
 * command line and passing things like...
 *
 * 1000 x Tritanium
 * Integrity Response Drones    14    Advanced Commodities            1,400 m3
 * @type {any}
 */
var EveParse = require('eve-parser').EveParser;

var parser = new EveParse(process.stdin);
parser.parse();
parser.stream.on('complete', () =>
{
    for (var total in parser.getTotals())
    {
        console.log(parser.showTotal(total));
    }
});
