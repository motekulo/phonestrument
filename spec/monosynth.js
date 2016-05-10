describe("Monosynth", function() {
    var synth;

    beforeEach(function() {
        synth = new Basicmonosynth();
    });

    it("should have a getSynth function", function() {
        expect(synth.getSynth()).toBeDefined();
    });

    it("Should be able to return the active synth", function() {

        expect(synth.getSynth()).not.toBe(null);
        //        expect(true).toBe(true);

    });

    it("should have an octave value with a default of 4", function() {
        expect(synth.moct).toEqual(4);

    });

});

