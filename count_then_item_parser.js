"use strict"
var BaseParser = require("./base_parser").BaseParser;

/**
 * Parses whitespace separated items followed by their count, with or
 * without commas delimiters in the 000 groups.
 *
 * Valid input examples...
 *
 * My Item 1,000
 * My Item 1000
 */
class CountThenItemParser extends BaseParser {
    constructor()
    {
        super();
        this.name = "CountThenItemParser";
        // 2 main groups, item, count
        // We use non-capture groups so that the match array only has the items we
        // need.  This is defined by (?:regex here).  Note the '?:'
        this.itemCount = "^([-]{0,1}\\d+(?:,\\d+)*)";
        // alphabetic sequence with possible but not required spaces
        this.itemName = "([a-zA-Z]+(?:\\s+[a-zA-Z]+)*)";
        this.regex = this.itemCount + "\\s*" + this.itemName + ".*$";
    }

    /**
     * We have to swap the data locations, as inventory items have descriptions
     * first, not counts.
     *
     * @param line the input line
     * @returns [super.parse(line)[1], super.parse(line)[0]]
     */
/*    parse(line)
    {
        var match = super.parse(line);
        //console.log(match);
        //console.log([match[1], match[0]]);
        return [match[1], match[0]];
    };*/
}

module.exports.CountThenItemParser = CountThenItemParser;