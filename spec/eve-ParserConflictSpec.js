"use strict";
var stream = require('stream');
var fs = require('fs');
var parsers = (require('../index.js').EveParser.parsers);
var EveParser = require('../index.js');
var blueprintParser = new EveParser.BlueprintParser();
var countThenItemParser = new EveParser.CountThenItemParser();
var itemThenCountParser = new EveParser.ItemThenCountParser();
var inventoryListParser = new EveParser.InventoryListParser();


describe('parsers do not conflict', function ()
{
    var blueprintInput = "1,000 x Integrity Response Drones";
    var inventoryInput = "Integrity Response Drones  1,000  Blah   1,400 m3";
    var countThenItemInput = "1,000  Integrity Response Drones";
    var itemThenCountInput = "Integrity Response Drones  1,000";

    var expectedParsedResult = ['1000', 'Integrity Response Drones'];
    /*
     many of these tests are here just to make it easy to identify problems in
     parsing.  They are listed in order of dependency.  In other words,
     the dependant ones are below those they depend on to be working.

     Ironically, there's more testing code than there is actual parsing code.
     */

    it('blueprint conflict test', function ()
    {
        expect(blueprintParser.matches(blueprintInput)).toBeTruthy();

        var parsed = blueprintParser.parse(blueprintInput);
        expect (parsed.length !== undefined && parsed.length === 2 &&
                expectedParsedResult[0] === parsed[0] &&
                expectedParsedResult[1] === parsed[1]).toBeTruthy();

        expect(itemThenCountParser.matches(blueprintInput)).toBeFalsy();
        parsed = itemThenCountParser.parse(blueprintInput);
        expect (parsed.length !== undefined && parsed.length === 2 &&
                expectedParsedResult[0] === parsed[0] &&
                expectedParsedResult[1] === parsed[1]).toBeFalsy();

        expect(inventoryListParser.matches(blueprintInput)).toBeFalsy();
        parsed = inventoryListParser.parse(blueprintInput);
        expect (parsed.length !== undefined && parsed.length === 2 &&
                expectedParsedResult[0] === parsed[0] &&
                expectedParsedResult[1] === parsed[1]).toBeFalsy();

/*        parsed = countThenItemParser.parse(blueprintInput);
        expect (parsed.length !== undefined && parsed.length === 2 &&
                expectedParsedResult[0] === parsed[0] &&
                expectedParsedResult[1] === parsed[1]).toBeFalsy();
        expect(countThenItemParser.matches(blueprintInput)).toBeFalsy();*/


    });

    it('inventory conflict test', function ()
    {
        expect(inventoryListParser.matches(inventoryInput)).toBeTruthy();

        var parsed = inventoryListParser.parse(inventoryInput);
        expect (parsed.length !== undefined && parsed.length === 2 &&
                expectedParsedResult[0] === parsed[0] &&
                expectedParsedResult[1] === parsed[1]).toBeTruthy();

/*        expect(itemThenCountParser.matches(inventoryInput)).toBeFalsy();
        parsed = itemThenCountParser.parse(inventoryInput);
        expect (parsed.length !== undefined && parsed.length === 2 &&
                expectedParsedResult[0] === parsed[0] &&
                expectedParsedResult[1] === parsed[1]).toBeFalsy();

        expect(blueprintParser.matches(inventoryInput)).toBeFalsy();
        parsed = blueprintParser.parse(inventoryInput);
        expect (parsed.length !== undefined && parsed.length === 2 &&
                expectedParsedResult[0] === parsed[0] &&
                expectedParsedResult[1] === parsed[1]).toBeFalsy();*/
    });
});