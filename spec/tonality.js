describe("tonality", function() {
    var tonality;

    beforeEach(function() {
        tonality = new Tonality();
    });

    it("can create a new tonality object with properties for key of C", function() {
        expect(tonality.key).toBe(0);
        expect(tonality.scaleStructure[1]).toBe(2);
        expect(tonality.fullScale[1]).toBe(2);
        expect(tonality.fullScale[8]).toBe(14);
        expect(tonality.fullScale[14]).toBe(24);

    });
    it("can change key", function() {
        tonality.setKey(5); // key of F
        expect(tonality.getKey()).toBe(5);
        expect(tonality.key).toBe(5);
        expect(tonality.fullScale[1]).toBe(7);
        expect(tonality.fullScale[8]).toBe(19);
        expect(tonality.fullScale[14]).toBe(29);

    });

    it("can get scale array", function() {
        tonality.setKey(11); // key of B
        var keyOfBArray = tonality.getFullScale();
        expect(keyOfBArray[0]).toBe(11);
        expect(keyOfBArray[13]).toBe(34);  // A#

    });

    it("can get a chord array", function() {
        var cMajorChord = tonality.getChord(1, 5, []);
        expect(cMajorChord[0]).toBe(0);
        expect(cMajorChord[1]).toBe(4);
        expect(cMajorChord[2]).toBe(7);

        var bMinorChord = tonality.getChord(3, 5, []);
        expect(bMinorChord[0]).toBe(2);
        expect(bMinorChord[1]).toBe(5);
        expect(bMinorChord[2]).toBe(9);

    });


});
