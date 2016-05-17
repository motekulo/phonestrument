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
        converteddata = adaptor.convertData(data);
        expect(converteddata[0]).toBe(0);
        expect(converteddata[1]).toBe("2:0:0 + (1 * 16n)");
        expect(converteddata[2]).toBe("C4");

    });

    it("can be queried to provide bar diaply info", function() {
        part.addVoice();
        part.addVoice();
        part.setNoteArray(0, "1:0:0 + (2 * 4n)", "D5");
        part.setNoteArray(0, "1:0:0 + (3 * 4n)", "E5");
        part.setNoteArray(1, "1:0:0 + (0 * 4n)", "D5");
        part.setNoteArray(1, "1:0:0 + (1 * 4n)", "E5");
        var bar = 1;
        var division = "16";
        //var timestring;
        var bararray = adaptor.getBarArray(bar, division);
        expect(bararray[0][0]).toBe(0);
        expect(bararray[0][8]).toBe(1);
        expect(bararray[0][12]).toBe(1);
        expect(bararray[1][0]).toBe(1);
        expect(bararray[1][4]).toBe(1);
        expect(bararray[1][12]).toBe(0);

    });

    it("should be able to play polyphonically", function() {

        part.addVoice();
        part.setNoteArray(0, "1:0:0 + (3 * 4n)", "D5");
        //part.setNoteArray(0, "1:0:0 + (3 * 4n)", "F5");
        var testarray = part.voices[0].at("1:0:0 + (3 * 4n)");
        console.log("testarray is " + testarray);
        var bar = 1;
        var division = "16";
        var bararray = adaptor.getBarArray(bar, division);
        console.log("bararray is " + bararray);

    });

});

