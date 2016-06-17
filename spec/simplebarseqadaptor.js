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


    it("should return an array to the bar sequencer", function() {

        adaptor = new SimpleBarSequencerAdaptor();
        part = new Tone.Part;
        adaptor.setScale("C");
        part.at("1:0:0 + (2 * 4n)", ["C5","D5"]);
        part.at("1:0:0 + (3 * 4n)", "E5");
        part.at("1:0:0 + (0 * 4n)", "D5");
        var bararray = adaptor.getBarArray(part, 1, 16); 
        expect(bararray[8][0]).toBe(1);
        expect(bararray[8][1]).toBe(1);
        expect(bararray[12][2]).toBe(1);
        expect(bararray[0][1]).toBe(1);
    });

});

