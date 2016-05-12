describe("Part", function() {
    var part;

    beforeEach(function() {
        part = new Part();
    });

    it("can add a voice", function() {
        expect(part.voices.length).toEqual(0);
        part.addVoice();
        expect(part.voices.length).toEqual(1);
    });

    it("can have note array values set", function() {
        part.addVoice();
        part.setNoteArray(0, "4n", "C4");
        var pitch = part.voices[0].at("4n");
        expect(pitch.value).toMatch("C4");

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
        var timestring;
        var bararray = part.getBarArray(bar, division);
        expect(bararray[0][0]).toBe(0);
        expect(bararray[0][8]).toBe(1);
        expect(bararray[0][12]).toBe(1);
        expect(bararray[1][0]).toBe(1);
        expect(bararray[1][4]).toBe(1);
        expect(bararray[1][12]).toBe(0);

    });

});

