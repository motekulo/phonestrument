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

        var eMinorChord = tonality.getChord(3, 5, []);
        expect(eMinorChord[0]).toBe(4);
        expect(eMinorChord[1]).toBe(7);
        expect(eMinorChord[2]).toBe(11);

    });
    it("can get a chord array in different keys", function() {
        tonality.setKey(4); // key of E
        var eMajorChord = tonality.getChord(1, 5, []);
        expect(eMajorChord[0]).toBe(4);
        expect(eMajorChord[1]).toBe(8);
        expect(eMajorChord[2]).toBe(11);

        var bMajorChord = tonality.getChord(5, 5, []);
        expect(bMajorChord[0]).toBe(11);
        expect(bMajorChord[1]).toBe(15);
        expect(bMajorChord[2]).toBe(18);

    });
    it("can get chords up to 13th", function() {
        tonality.setKey(2); // key of E
        var dMajor7Chord = tonality.getChord(1, 7, []);
        expect(dMajor7Chord[0]).toBe(2);
        expect(dMajor7Chord[1]).toBe(6);
        expect(dMajor7Chord[2]).toBe(9);
        expect(dMajor7Chord[3]).toBe(13);

        var a7Chord = tonality.getChord(5, 7, []);
        expect(a7Chord[3]).toBe(19);

        var a9Chord = tonality.getChord(5, 9, []);
        expect(a9Chord[4]).toBe(23);

        var a11Chord = tonality.getChord(5, 11, []);
        expect(a11Chord[5]).toBe(26);

        var a13Chord = tonality.getChord(5, 13, []);
        expect(a13Chord[6]).toBe(30);

        // test highest extension - key of B, chord 7, 13th (unlikely!)
        tonality.setKey(11);
        var aSharpDim13 = tonality.getChord(7, 13, []);
        expect(aSharpDim13[6]).toBe(42);

    });

    it("can alter notes in chords outside diatonic tones", function() {
        tonality.setKey(7);  // test with G major
        var c7Chord = tonality.getChord(4,7,[0,0,0,-1]);
        expect(c7Chord[3]).toBe(22);

        var aMinor7Flat5 = tonality.getChord(2,7,[0,0,-1,0]);
        expect(aMinor7Flat5[2]).toBe(15);

    });

    it("can return an array over full midi note range for a chord", function() {
        var allCMajorChord = tonality.getFullChordArray(1, 5, []); // a simple C triad
        expect(allCMajorChord[3]).toBe(12);
        expect(allCMajorChord[6]).toBe(24);
        expect(allCMajorChord[7]).toBe(28);
        expect(allCMajorChord[8]).toBe(31);
        expect(allCMajorChord[30]).toBe(120);

        tonality.setKey(10);  // Bflat major
        var c7 = tonality.getFullChordArray(2, 7, [0, 1, 0 ,0]);
        expect(c7[1]).toBe(16);
        expect(c7[3]).toBe(22);
        expect(c7[11]).toBe(46);

    });

    it("can trim a chord or scale array between lower and upper midi note limits", function() {
        var trimmedArray = tonality.trimArray(tonality.fullScale, 36, 84);
        expect(trimmedArray[0]).toBeGreaterThan(36);
        expect(trimmedArray[trimmedArray.length - 1]).toBeLessThan(84);

        var chordArray = tonality.getFullChordArray(1, 7, []);
        trimmedArray = tonality.trimArray(chordArray, 40, 98);
        expect(trimmedArray[0]).toBeGreaterThan(40);
        expect(trimmedArray[trimmedArray.length - 1]).toBeLessThan(98);

    });

});
