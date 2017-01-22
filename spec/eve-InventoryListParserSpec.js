"use strict";
var stream = require('stream');
var fs = require('fs');
var InventoryListParser = require('../index.js').InventoryListParser;

describe('InventoryListParser is valid', function ()
{
    var inputLineWithSpaces = "Integrity Response Drones  1,000  Blah   1,400 m3";
    var inputLineWithTabs = "Integrity Response Drones	1,000	Blah			1,400 m3";
    var inputLineWithDecimals = "Integrity Response Drones	1,000	Blah			1,400.23 m3";

    var parser = new InventoryListParser();
    /*
     many of these tests are here just to make it easy to identify problems in
     parsing.  They are listed in order of dependency.  In other words,
     the dependant ones are below those they depend on to be working.

     Ironically, there's more testing code than there is actual parsing code.
     */

    it('InventoryListParser items match', function ()
    {
        //expect(parser.matches(inputLineWithSpaces)).toBeTruthy();
        expect(parser.matches(inputLineWithTabs)).toBeTruthy();
    });
    it('InventoryListParser line components retrievable', function ()
    {
        var match = [0, 0];
        /*match = inputLineWithSpaces.match(parser.regex);
        expect(match[3]).toEqual("Integrity Response Drones");
        expect(match[1]).toEqual("1,000");*/
        match = inputLineWithTabs.match(parser.regex);
        expect(match[1]).toEqual("Integrity Response Drones");
        expect(match[2]).toEqual("1,000");
        match = inputLineWithDecimals.match(parser.regex);
        expect(match[1]).toEqual("Integrity Response Drones");
        expect(match[2]).toEqual("1,000");
    });
    it('InventoryListParser parsing successful', function ()
    {
        expect(parser.parse(inputLineWithTabs)).toEqual(
            ['1000', 'Integrity Response Drones']);
/*        expect(parser.parse(inputLineWithSpaces)).toEqual(
            ['1000', 'Integrity Response Drones']);*/
    });
});

