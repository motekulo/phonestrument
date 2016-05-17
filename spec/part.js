describe("Part", function() {
    var part;

    beforeEach(function() {
        part = new Part();
    });

    it("can have note array values set", function() {
        part.tonepart.at("4n", "C4");
        var pitch = part.tonepart.at("4n");
        expect(pitch.value).toMatch("C4");

    });

});

