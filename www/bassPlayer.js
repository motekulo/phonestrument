
bassPlayer = function(game) {
    this.bubbles;  // main group of bubble sprites
};

bassPlayer.prototype = {
    preload: function() {
        console.log("Pre-loading");
        game.load.image('bubble', 'assets/bubble256.png');
        game.load.spritesheet('playpausebutton', 'assets/pause_play_reset.png', 148, 80);
    },

    create: function() {
        console.log("Create");
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.bubbles = game.add.group();
        this.bubbles.enableBody = true;
        this.bubbles.physicsBodyType = Phaser.Physics.ARCADE;
        game.physics.enable(this.bubbles, Phaser.Physics.ARCADE);

        for (var i = 0; i < 2; i++) {
            var musBubble = this.bubbles.create(game.world.randomX, game.world.randomY, 'bubble');
            musBubble.anchor.set(0.5, 0.5);
        }
        //makeBubbles();
    },

    update: function() {

    }
}
