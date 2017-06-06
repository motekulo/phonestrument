describe("bassplayer", function() {
    var bassplayer;

    beforeEach(function() {
        game = new Phaser.Game(100, 100, Phaser.AUTO, "");
        game.state.add("BassPlayer", bassPlayer);
        game.state.start("BassPlayer");
        bassplayer = game.state.states.BassPlayer;
        //bassplayer.create();
        //player = new bassPlayer();
        //player.create();
    });

    it("can create a new tonality object with properties for key of C", function() {
        expect(bassplayer.timeSubDiv).toBe(8);
        // expect(tonality.scaleStructure[1]).toBe(2);
        // expect(tonality.fullScale[1]).toBe(2);
        // expect(tonality.fullScale[8]).toBe(14);
        // expect(tonality.fullScale[14]).toBe(24);

    });

});
