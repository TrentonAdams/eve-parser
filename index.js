"use strict";
var BaseParser = require("./base_parser").BaseParser;
var BlueprintParser = require("./blueprint_parser").BlueprintParser;
var InventoryListParser = require("./inventory_list_parser").InventoryListParser;
var ItemThenCountParser = require("./item_count_parser").ItemThenCountParser;

module.exports.BaseParser = BaseParser;
module.exports.BlueprintParser = BlueprintParser;
module.exports.InventoryListParser = InventoryListParser;
module.exports.ItemThenCountParser = ItemThenCountParser;

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

/**
 * Create an EveParser object.  Note that in order to use the object you must
 * hook the eveParser.rl.on('complete', function(){}); to receive the complete
 * event, which happens after parsing of stdin completes.
 * @constructor
 */
var EveParser = function (stream)
{
    const split2 = require('split2');

    this.stream = stream;
    // regexes for matching various types of standard eve inputs
    /**
     * Parses the format that you can copy from within the blueprint.
     */

    var materials = new Array();

    var $this = this;
    var totals = {};

    /**
     * Parses the input from the stream, automatically determining the type
     * of eve input.
     */
    this.parse = function parse()
    {
        stream.pipe(split2()).on('data', function (input)
        {
            //console.log(input);
            parseLine(input);
        }).on('end', function ()
        {
            for (var line = 0; line < materials.length; line++)
            {
                var matName = materials[line][1];
                var matCount = Number(materials[line][0]);
                //console.log("name: %s, count: %s", matName, matCount);
                sumMaterialsByName(totals, matName, matCount);
            }
            materials = null;
            stream.emit('complete');
        });
    };

    /**
     * Determines the type of eve line that is being read, and parses it
     * accordingly.
     *
     * @param input an input line
     */
    function parseLine(input)
    {
        var matchedParser;

        for (var index = 0; index < EveParser.parsers.length; index++)
        {
            if (EveParser.parsers[index].matches(input))
            {
                matchedParser = EveParser.parsers[index];
                break;  // found one, we're done
            }
        }
        //console.log($this.matchedParser.name);
        if (matchedParser !== undefined)
        {   // no parser means silently ignore.
            //console.log($this.matchedParser.parse(input));
            materials.push(matchedParser.parse(input));
        }
    }

    function sumMaterialsByName(totals, matName, matCount)
    {   // hidden from caller
        if (totals[matName] !== undefined)
        {
            totals[matName] += matCount;
        }
        else
        {
            totals[matName] = matCount;
        }
    }

    /**
     * @param s the material name - must match a material that came in on stdin.
     * @returns {string} the total in the format of "100 x Name".
     */
    this.showTotal = function (s)
    {
        return totals[s] !== undefined ? totals[s] + ' ' + s : '0 ' + s;
    };

    /**
     * Retrieves the map of totals by material name.
     * @returns e.g. {"Tritanium": "1000", "Pyerite": "1000"}
     */
    this.getTotals = function ()
    {
        return totals;
    };
};

EveParser.parsers = [
    new BlueprintParser(), new InventoryListParser(),
    new ItemThenCountParser(), new CountThenItemParser()];

/**
 * {@link BaseParser}
 * @type {EveParser}
 */
module.exports.EveParser = EveParser;
