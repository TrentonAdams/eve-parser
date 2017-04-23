"use strict"
var BaseParser = require("./base_parser").BaseParser;

/**
 * Parses blueprint materials in the form of...
 *
 * 1000 x Tritanium
 *
 * And splits it into an array of two.
 *
 * e.g. ['1000', 'Tritanium']
 *
 * This is the data copied from the main blueprint view, showing the
 * materials required by the blueprint (show info).  It can *not* parse the
 * materials from the industry window where you right click and "copy material information"
 *
 * @constructor
 */

class BlueprintParser extends BaseParser {
    constructor()
    {
        super();
        this.name = "BlueprintParser";
        // number only at the beginning of the strong
        this.itemCount = "^((?:[-]{0,1}(?:\\d+)(?:,\\d)*){1,})";
        // any alphabetic string, including optional spaces, at the end
        this.itemName = " x ([a-zA-Z\\-]+(?:\\s+[a-zA-Z\\-]+)*).*$";
        this.regex = this.itemCount + this.itemName;
    }
}

module.exports.BlueprintParser = BlueprintParser;