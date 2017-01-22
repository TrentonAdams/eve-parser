"use strict";
var stream = require('stream');
var fs = require('fs');
var EveParser = require('../index.js').EveParser;
var InventoryListParser = require('../index.js').InventoryListParser;
var BlueprintParser = require('../index.js').BlueprintParser;

describe('BlueprintParser is valid', function ()
{
    var inputLineWithSpaces = "1,000 x Integrity Response Drones";
    var parser = new BlueprintParser();
    /*
     many of these tests are here just to make it easy to identify problems in
     parsing.  They are listed in order of dependency.  In other words,
     the dependant ones are below those they depend on to be working.

     Ironically, there's more testing code than there is actual parsing code.
     */

    it('BlueprintParser  items match', function ()
    {
        expect(parser.matches(inputLineWithSpaces)).toBeTruthy();
    });

    it('BlueprintParser line components retrievable', function ()
    {
        var match = [0, 0];
        match = parser.parse(inputLineWithSpaces);
        expect(match[0]).toEqual("1000");
        expect(match[1]).toEqual("Integrity Response Drones");

        match = inputLineWithSpaces.match(parser.itemCount);
        expect(match[1]).toEqual("1,000");
        match = inputLineWithSpaces.match(parser.itemName);
        expect(match[1]).toEqual("Integrity Response Drones");
    });

    it('BlueprintParser parsing successful', function ()
    {
        expect(parser.parse(inputLineWithSpaces)).toEqual(
            ['1000', 'Integrity Response Drones']);
    });
});