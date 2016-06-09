describe("phonestrument", function() {
    var phonestrument;

    beforeEach(function() {
        phonestrument = new Phonestrument(120, 3, "D", 3);
    });

    it("can create a new phonestrument with properties ", function() {
        expect(phonestrument.tempo).toBe(120);
        expect(phonestrument.timesig).toBe(3);
        expect(phonestrument.key).toBe("D");
        expect(phonestrument.player.length).toBe(3);

    });

    it("can create a new player", function() {
        expect(phonestrument.player[0].part).toBe("new part");
        expect(phonestrument.player[0].instrument).toBe("new instrument");

    });


});

