"use strict";
var stream = require('stream');
var EveParser = require('../index.js').EveParser;
var InventoryListParser = require('../index.js').InventoryListParser;
var BlueprintParser = require('../index.js').BlueprintParser;

describe("can create EveParser", function ()
{
    it("create EveParser", function ()
    {
        var eveParser = new EveParser(process.stdin);
        expect(eveParser).toBeDefined();
    });
});

for (var index = 0; index < EveParser.parsers.length; index++)
{
    var extparser = EveParser.parsers[index];
    //console.log(parser);
    (function (parser)
    {   // closure required or parser gets shared and each run is the same as
        // the last one set.
        describe(parser.name + " parser selection", function ()
        {
            var eveParser;
            beforeEach(function ()
            {
                // initialize the parser each iteration.
                initializeTest();
            });

            it("1000 + 1000 Tritanium is 2000", function (done)
            {
                eveParser.stream.on('complete', () =>
                {
                    expect(eveParser.showTotal('Tritanium')).toEqual(
                        '2000 Tritanium');
                    done();
                });
            });
            it("100 + 100 Isogen is 200", function (done)
            {
                eveParser.stream.on('complete', () =>
                {
                    expect(eveParser.showTotal('Isogen')).toEqual(
                        '200 Isogen');
                    done();
                });
            });
            it("50 - 1 Nocxium is 49", function (done)
            {
                eveParser.stream.on('complete', function ()
                {
                    expect(eveParser.showTotal('Nocxium')).toEqual(
                        '49 Nocxium');
                    done();
                });
            });
            it("other minerals unchanged", function (done)
            {
                eveParser.stream.on('complete', () =>
                {
                    expect(eveParser.showTotal('Pyerite')).toEqual(
                        '500 Pyerite');
                    expect(eveParser.showTotal('Mexallon')).toEqual(
                        '250 Mexallon');
                    expect(eveParser.showTotal('Zydrine')).toEqual(
                        '20 Zydrine');
                    done();
                });
            });
            it("contains all components", function (done)
            {
                eveParser.stream.on('complete', () =>
                {
                    var totals = Object.keys(eveParser.getTotals());
                    expect(totals).toContain('Tritanium');
                    expect(totals).toContain('Pyerite');
                    expect(totals).toContain('Mexallon');
                    expect(totals).toContain('Nocxium');
                    expect(totals).toContain('Zydrine');
                    expect(totals).toContain('Isogen');
                    done();
                });
            });

            function initializeTest()
            {
                //console.log(parser.name);
                var testStream = new stream.Readable();
                testStream._read = function noop()
                {
                };

                if (parser.name === 'BlueprintParser')
                {
                    testStream.push("1000 x Tritanium\n500 x Pyerite\n" +
                        "250 x Mexallon\n100 x Isogen\n50 x Nocxium\n20 x Zydrine\n" +
                        "-1 x Nocxium\n1000 x Tritanium\n100 x Isogen\n");
                }
                else if (parser.name === 'InventoryListParser')
                {
                    testStream.push(
                        "Tritanium	1000	Blah			1,400 m3\n" +
                        "Pyerite	500	Advanced Commodities			7,100 m3\n" +
                        "Mexallon	250	Advanced Commodities			1,900 m3\n" +
                        "Isogen	100	Advanced Commodities			7,400 m3\n" +
                        "Nocxium	50	Advanced Commodities			400 m3\n" +
                        "Nocxium	-1	Advanced Commodities			400 m3\n" +
                        "Zydrine	20	Advanced Commodities			7,400 m3\n" +
                        "Tritanium	1000	Blah			1,400 m3\n" +
                        "Isogen	100	Advanced Commodities			7,400 m3\n");
                }
                else if (parser.name === 'ItemThenCountParser')
                {
                    testStream.push(
                        "Tritanium	1000\n" +
                        "Pyerite	500\n" +
                        "Mexallon	250\n" +
                        "Isogen	100\n" +
                        "Nocxium	50\n" +
                        "Nocxium	-1\n" +
                        "Zydrine	20\n" +
                        "Tritanium	1000\n" +
                        "Isogen	100\n");
                }
                else if (parser.name === 'CountThenItemParser')
                {
                    testStream.push(
                        "1000   Tritanium\n" +
                        "500    Pyerite\n" +
                        "250    Mexallon\n" +
                        "100    Isogen\n" +
                        "50 Nocxium\n" +
                        "-1 Nocxium\n" +
                        "20 Zydrine\n" +
                        "1000   Tritanium\n" +
                        "100    Isogen\n");
                }
                else
                {
                    fail('unknown parser');
                }

                testStream.push(null);
                eveParser = new EveParser(testStream);
                eveParser.parse();
            }
        });
    })(extparser);
}

describe("multi-format parsing", function ()
{
    var eveParser;
    beforeEach(function ()
    {
        var testStream = new stream.Readable();
        testStream._read = function noop()
        {
        };

        testStream.push(
            "1000 x Tritanium\n500 x Pyerite\n" +
            "Mexallon	250	Advanced Commodities			1,900 m3\n" +
            "Isogen	100	Advanced Commodities			7,400 m3\n" +
            "Nocxium	50	Advanced Commodities			400 m3\n" +
            "Nocxium	-1	Advanced Commodities			400 m3\n" +
            "Zydrine	20	Advanced Commodities			7,400 m3\n" +
            "Tritanium	1000	Blah			1,400 m3\n" +
            "Isogen	100	Advanced Commodities			7,400 m3\n");

        testStream.push(null);
        eveParser = new EveParser(testStream);
        eveParser.parse();
    });

    it("1000 + 1000 Tritanium is 2000", function (done)
    {
        eveParser.stream.on('complete', () =>
        {
            expect(eveParser.showTotal('Tritanium')).toEqual(
                '2000 Tritanium');
            done();
        });
    });
    it("100 + 100 Isogen is 200", function (done)
    {
        eveParser.stream.on('complete', () =>
        {
            expect(eveParser.showTotal('Isogen')).toEqual(
                '200 Isogen');
            done();
        });
    });
    it("50 - 1 Nocxium is 49", function (done)
    {
        eveParser.stream.on('complete', function ()
        {
            expect(eveParser.showTotal('Nocxium')).toEqual(
                '49 Nocxium');
            done();
        });
    });
    it("other minerals unchanged", function (done)
    {
        eveParser.stream.on('complete', () =>
        {
            expect(eveParser.showTotal('Pyerite')).toEqual(
                '500 Pyerite');
            expect(eveParser.showTotal('Mexallon')).toEqual(
                '250 Mexallon');
            expect(eveParser.showTotal('Zydrine')).toEqual(
                '20 Zydrine');
            done();
        });
    });
    it("contains all components", function (done)
    {
        eveParser.stream.on('complete', () =>
        {
            var totals = Object.keys(eveParser.getTotals());
            expect(totals).toContain('Tritanium');
            expect(totals).toContain('Pyerite');
            expect(totals).toContain('Mexallon');
            expect(totals).toContain('Nocxium');
            expect(totals).toContain('Zydrine');
            expect(totals).toContain('Isogen');
            done();
        });
    })
});