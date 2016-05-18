describe("Simple bar sequencer adaptor", function() {
    var adaptor;

    beforeEach(function() {
        adaptor = new SimpleBarSequencerAdaptor();
        part = new Part();
        adaptor.connectToPart(part);
    });

    it("should be able to be connected to a part", function() {
        expect(adaptor.part).toBeDefined();

    });

    it("should be able to receive data to convert ", function() {
        var data = ["2:0:0", 0, 1, 1];  // simple bar seq sends transport pos, row, col, val
        var converteddata = [];
        adaptor.setScale("C");
        converteddata = adaptor.convertData(data);
        expect(converteddata[0]).toBe("2:0:0 + (1 * 16n)");
        expect(converteddata[1]).toBe("C4");

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

    it("should return an array to the bar sequencer", function() {

        adaptor = new SimpleBarSequencerAdaptor();
        part = new Part();
        adaptor.connectToPart(part);
        adaptor.setScale("C");
        part.tonepart.at("1:0:0 + (2 * 4n)", ["C5","D5"]);
        part.tonepart.at("1:0:0 + (3 * 4n)", "E5");
        part.tonepart.at("1:0:0 + (0 * 4n)", "D5");
        var bararray = adaptor.getBarArray(1, 16); 
        expect(bararray[0][8]).toBe(1);
        expect(bararray[1][8]).toBe(1);
        expect(bararray[2][12]).toBe(1);
        expect(bararray[1][0]).toBe(1);
    });




/*
    it("can be queried to provide bar display info", function() {
        part.tonepart.at("1:0:0 + (2 * 4n)", "D5");
        part.tonepart.at("1:0:0 + (3 * 4n)", "E5");
//        part.tonepart.at("1:0:0 + (0 * 4n)", "D5");
        part.tonepart.at("1:0:0 + (1 * 4n)", "E5");
        var bar = 1;
        var division = "16";
        //var timestring;
        var bararray = adaptor.getBarArray(bar, division);
        expect(bararray[0][0]).toBe(0);
        expect(bararray[0][8]).toBe("D5");
        expect(bararray[0][12]).toBe("E5");
//        expect(bararray[1][0]).toBe(1);
//        expect(bararray[1][4]).toBe(1);
//        expect(bararray[1][12]).toBe(0);

    });
*/
/*    it("should be able to play polyphonically", function() {

        part.addVoice();
        part.setNoteArray(0, "1:0:0 + (3 * 4n)", "D5");
        //part.setNoteArray(0, "1:0:0 + (3 * 4n)", "F5");
        var testarray = part.voices[0].at("1:0:0 + (3 * 4n)");
        console.log("testarray is " + testarray);
        var bar = 1;
        var division = "16";
        var bararray = adaptor.getBarArray(bar, division);
        console.log("bararray is " + bararray);

    }); */

});

