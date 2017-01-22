"use strict";
var stream = require('stream');
var fs = require('fs');
var CountThenItemParser = require('../index.js').CountThenItemParser;

describe('CountThenItemParser is valid', function ()
{
    var inputLines = [
        "1,000  Integrity Response Drones",
        "1,000  Integrity Response Drones"];

    var parser = new CountThenItemParser();
    /*
     many of these tests are here just to make it easy to identify problems in
     parsing.  They are listed in order of dependency.  In other words,
     the dependant ones are below those they depend on to be working.

     Ironically, there's more testing code than there is actual parsing code.
     */

    it('CountThenItemParser items match', function ()
    {
        //expect(parser.matches(inputLineWithSpaces)).toBeTruthy();
        for (var index = 0; index < inputLines.length; index++)
        {
            expect(parser.matches(inputLines[index])).toBeTruthy();
        }
    });
    it('CountThenItemParser line components retrievable', function ()
    {
        for (var index = 0; index < inputLines.length; index++)
        {
            var match = [0, 0];
            match = inputLines[index].match(parser.regex);
            expect(match[1]).toEqual("1,000");
            expect(match[2]).toEqual("Integrity Response Drones");
        }
    });
    it('CountThenItemParser parsing successful', function ()
    {
        for (var index = 0; index < inputLines.length; index++)
        {
            expect(parser.parse(inputLines[index])).toEqual(
                ['1000', 'Integrity Response Drones']);
        }
    });
});

