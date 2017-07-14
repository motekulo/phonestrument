
krungKrang = function(game) {
    this.bounceBalls; // main group of bouncers
    this.kickPlayers; // group of kick drum players
    this.snarePlayers;
    this.stringPlayers;
    this.ballScale = 0.25;

    this.panVol = new Tone.PanVol(0.5, -18);
    var urls = ["./assets/samples/kick_mix_1.mp3",
                "./assets/samples/snare_mix_1.mp3",
                "./assets/samples/chh_mixed_1.mp3", "./assets/samples/ohh_mixed_1.mp3"];

    this.samplesLoaded = function() {
        this.loaded++;
        console.log("Num samples loaded: " + this.loaded);
    }
    //var self = this;
    var drumPlayer1 = new Tone.MultiPlayer(urls, (this.samplesLoaded).bind(this));
    // var drumPlayer2 = new Tone.MultiPlayer(urls, (this.samplesLoaded).bind(this));
    // var drumPlayer3 = new Tone.MultiPlayer(urls, (this.samplesLoaded).bind(this));
    // var drumPlayer4 = new Tone.MultiPlayer(urls, (this.samplesLoaded).bind(this));

    drumPlayer1.connect(this.panVol);
    // drumPlayer2.connect(this.panVol);
    // drumPlayer3.connect(this.panVol);
    // drumPlayer4.connect(this.panVol);
    this.panVol.connect(Tone.Master);
};

krungKrang.prototype = {
    preload: function() {
        //console.log("Pre-loading");
        game.load.image('ball', 'assets/bubble256.png');
        game.load.image('brick', 'assets/brick0.png');
        game.load.spritesheet('playpausebutton', 'assets/pause_play_reset.png', 148, 80);
    },

    create: function() {

        // Debug:
        vertHalfLine = new Phaser.Line(game.world.width/2, 0, game.world.width/2, game.world.height);
        horHalfLine = new Phaser.Line(0, game.world.height/2, game.world.width, game.world.height/2);

        this.bounceBalls = game.add.group();
        //this.tally++;
        //console.log("Create drumPlayer tally: " + this.tally);
        game.stage.backgroundColor = "#303f9f";
        game.physics.startSystem(Phaser.Physics.ARCADE);
        var x = game.world.width/2;
        var y = game.world.height/2;
        var bounceBall = this.bounceBalls.create(x, y, 'ball');
        game.physics.enable(bounceBall, Phaser.Physics.ARCADE);
        bounceBall.scale.set(this.ballScale);
        bounceBall.anchor.setTo(0.5, 0.5);
        bounceBall.body.collideWorldBounds = true;
        bounceBall.body.velocity.setTo(200, 200);
        bounceBall.body.bounce.setTo(1, 1);

    },

    update: function() {

    },

    // render: function() {
    //      game.debug.geom(vertHalfLine, 'rgba(255,0,0,1)');
    //      game.debug.geom(horHalfLine, 'rgba(255,0,0,1)');
    //      game.debug.text("x body" + this.bubbles.children[0].body.x, 20, 20);
    //      game.debug.text("x sprite" + this.bubbles.children[0].x, 20, 40);
    // },

    onDragStart: function(bubble, pointer) {


    },

    onDragStop: function(sprite, pointer) {


    },

}
