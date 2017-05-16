describe("patternPlayer", function() {
    var patternPlayer;

    beforeEach(function() {
        patternPlayer = new PatternPlayer();
    });

    it("can create a new tonality object", function() {
        expect(patternPlayer.noteLength).toBe("16n");

    });
    it("can set a note pattern", function() {
        patternPlayer.setNotes([24,28,31,35]);
        expect(patternPlayer.notes[0]).toBe(24);

    });
    it("can replace a note in pattern randomly", function() {
        patternPlayer.setNotes([24,28,31,35]);
        var index = patternPlayer.randomReplaceNote(99);
        expect(patternPlayer.notes.length).toBe(4);
        expect(patternPlayer.notes[index]).toBe(99);

    });


});
