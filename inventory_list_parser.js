"use strict"
var BaseParser = require("./base_parser").BaseParser;

/**
 * Parsers inventory lists in the tab separated form of...
 *
 * Integrity Response Drones    14    Advanced Commodities            1,400 m3
 *
 * Splits the input by tab character into an array of the first two, then
 * inverts their location.
 *
 * e.g. ['Integrity Response Drones', '14'] => ['14', 'Integrity Response Drones'];
 *
 * @constructor
 */
class InventoryListParser extends BaseParser {
    constructor()
    {
        super();
        this.name = "InventoryListParser";
        // 4 main groups, item, count, category (ignored), and m3 (ignored)
        // We use non-capture groups so that the match array only has the items we
        // need.  This is defined by (?:regex here).  Note the '?:'
        this.itemName = "^([a-zA-Z]+(?:\\s+[a-zA-Z]+)*)";
        this.itemCount = "([-]{0,1}\\d+(?:,\\d+)*)";
        this.regex = this.itemName +
            "\\s*" + this.itemCount +
            "\\s*[a-zA-Z]+(?:\\s+[a-zA-Z]+)*\\s*\\d+(?:,\\d+)*(?:.\d*)* m3.*$";
    }

    /**
     * We have to swap the data locations, as inventory items have descriptions
     * first, not counts.
     *
     * @param line the input line
     * @returns [super.parse(line)[1], super.parse(line)[0]]
     */
    parse(line)
    {
        var match = super.parse(line);
        //console.log(match);
        //console.log([match[1], match[0]]);
        return [match[1], match[0]];
    };
}

module.exports.InventoryListParser = InventoryListParser;