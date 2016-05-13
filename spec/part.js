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

});

