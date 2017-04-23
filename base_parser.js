"use strict";
/**
 * Base parser object.  The "match()" should not require any overriding, as
 * it simply takes the "regex" property you define in your inherited class, and
 * matches it against a line.
 *
 * The parse() function may need overriding, as per it's docs.
 * @constructor
 */
class BaseParser {
    constructor()
    {
        this.name = "Default BaseParser";
        this.removeCharacters = /[,\r\n]/g;
        this.itemCount = "";
        this.itemName = "";
        this.regex = "";
    }

    /**
     * Parses the input.  The regex set by your object *must* return only two
     * capture groups, the count and the item name.  That way, this base method
     * will always return the correct data (though possibly in the wrong order,
     * depending on the input order you're handling.
     *
     * Since the order of the count and the item name may vary, it may be
     * necessary to override the parse() function.  It returns
     * [match[1], match[2]]; by default.  You'll need to override it to swap
     * those if necessary, by calling super.parse(line) and swapping the results
     * as a return.
     *
     * An acceptable return for a parse that fails would be return
     * ['0', 'Invalid Input: ' + inputLine]; and that is what is currently
     * returned on parse failures.  However, if your this.regex is properly
     * setup, the parsing should be successful.  If it's not, you need to
     * revisit your this.regex or match() if you've overridden it.
     *
     * @param line the input line
     * @returns {*[]}
     */
    parse(line)
    {
        var inputLine = line.replace(this.removeCharacters, '');
        var match = inputLine.match(this.regex);
        //console.log('parse-inputLine: ', inputLine);
        //console.log('parse-removeCharacters: ', this.removeCharacters);
        //console.log('parse-match: ', match);
        if (match && match.length == 3)
        {   // ignore everything but a perfect match.
            //console.log([match[1], match[5]]);
            // e.g. ['1000', 'Integrity Response Drones']
            return [match[1], match[2]];
        }
        else
        {
            //console.log([match[1], match[5]]);
            return ['0', 'Invalid Input: ' + inputLine];
        }
    }

    /**
     * Your "this.regex" must return only two capture groups, one for count
     * and one for the item name.  Any other groups must be non-capturing.
     *
     * @param line the line to match.
     * @returns true if this parser can parse the line;
     */
    matches(line)
    {   // ignore everything but a perfect match.
        var match = line.match(this.regex);
        //console.log('matches-line: ', line);
        //console.log('matches-regex: ', this.regex);
        //console.log('matches-match: ', match);
        return match && match.length == 3;
    }
}

module.exports.BaseParser = BaseParser;