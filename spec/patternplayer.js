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
        expect(patternPlayer.pattern.values[0]).toBe(24);

    });
    it("can replace a note in pattern randomly", function() {
        patternPlayer.setNotes([24,28,31,35]);
        var index = patternPlayer.randomReplaceNote(99);
        expect(patternPlayer.pattern.values.length).toBe(4);
        expect(patternPlayer.pattern.values[index]).toBe(99);

    });
    it("can change the pattern randomly", function() {
        var currentPattern = patternPlayer.pattern.pattern;
        console.log("old pattern is " + currentPattern);
        var newPattern = patternPlayer.changePatternTypeRandomly();
        console.log("new pattern is " + newPattern);
        expect(patternPlayer.pattern.pattern).toBe(newPattern);

    });

});
