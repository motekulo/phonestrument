describe("app", function() {
    var phonestrument;

    beforeEach(function() {
        phonestrument = new Phonestrument(116, 4, "E", 2);
    });

    it("can create a new phonestrument with properties ", function() {
        expect(phonestrument.tempo).toBe(116);
        expect(phonestrument.timesig).toBe(4);
        expect(phonestrument.key).toBe("E");
        expect(phonestrument.player.length).toBe(2);

    });

    it("can create a new player", function() {
        expect(phonestrument.player[0].part).toBe("new part");
        expect(phonestrument.player[0].instrument).toBe("new instrument");

    });


});

