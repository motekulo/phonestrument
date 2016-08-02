describe("Simple bar sequencer adaptor", function() {
    var adaptor;

    beforeEach(function() {
        adaptor = new SimpleBarSequencerAdaptor();
    });

    it("can be constructed with defaults", function() {
        expect(adaptor.notesinscale).toBe(4);
        expect(adaptor.scalestructure).toEqual([2,2,1,2,2,2,1]);
        expect(adaptor.key).toBe("C");
        expect(adaptor.scale).toEqual(["C","D","E","F","G","A","B"]);
        expect(adaptor.octave).toBe(4);
    });


    it("can set a scale array", function() {
        var scale = adaptor.setScale("C");
        expect(scale[0]).toBe("C");
        expect(scale[1]).toBe("D");
        expect(scale[2]).toBe("E");
        expect(scale[3]).toBe("F");
        adaptor.notesinscale = 7;
        adaptor.scalestructure = [2,2,1,2,2,2,1];
        scale = adaptor.setScale("C");
        expect(scale[4]).toBe("G");
        expect(scale[5]).toBe("A");
        expect(scale[6]).toBe("B");
        scale = adaptor.setScale("G");
        expect(scale[0]).toBe("G");
        expect(scale[1]).toBe("A");
        expect(scale[2]).toBe("B");
        expect(scale[3]).toBe("C");
        expect(scale[4]).toBe("D");
        expect(scale[5]).toBe("E");
        expect(scale[6]).toBe("F#");

    });

    it("should be able to receive data to convert ", function() {
        var data = {
            row: 4,
            col: 1,
            level: 1
        }

        var pos = "2:0:0";
        var division = 16;
        var converteddata = [];
        adaptor.notesinscale = 7;
        adaptor.setScale("C");
        converteddata = adaptor.convertData(pos, data, division);
        expect(converteddata.time).toBe("2:0:0 + (1 * 16n)");
        expect(converteddata.note).toBe("G4");

        var data = {
            row: 3,
            col: 2,
            level: 1
        }

        var pos = "0:0:0";
        var division = 4;
        var converteddata = [];
        adaptor.notesinscale = 7;
        adaptor.setScale("F");
        converteddata = adaptor.convertData(pos, data, division);
        expect(converteddata.time).toBe("0:0:0 + (2 * 4n)");
        expect(converteddata.note).toBe("A#4");


    });

    it("creates a multidimensional array that can hold a visual representation", function() {
        expect(adaptor.sequencerViewData[4][1][3].length).toBe(7); // division, bar, column, row
        expect (adaptor.sequencerViewData[16][3].length).toBe(16);
    });

    it("can update and retrieve visual representation of sequencer", function() {
        /* The nexusUI matrix represents sequencer data in the form of columss, rows
        * so recreate that here for thee test. Note that the widget has its XY data
        * set up strangely, with columns as the first array index
        */
        var matrix = new Array(16);  // representing bar divisions -
        matrix[15] = new Array(7);  // 7 being the number of rows (different note values)
        matrix[15][4] = 1;    // last 16th note in bar, note number 5 in scale
        adaptor.updateViewData(2, 16, matrix);    // bar, division, data
        expect(adaptor.sequencerViewData[16][2][15][4]).toBe(1);     // div, bar, col, row
    });

    it("can remove and add bars from the sequencer view data", function() {
        expect(adaptor.sequencerViewData[4].length).toBe(4);
        adaptor.adjustViewArray(-2);
        expect(adaptor.sequencerViewData[4].length).toBe(2);
        adaptor.adjustViewArray(4);
        expect(adaptor.sequencerViewData[4].length).toBe(6);

    });


});
