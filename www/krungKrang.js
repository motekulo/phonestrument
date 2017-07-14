
var bounceBall;
var arrow;
var analog;

krungKrang = function(game) {
    this.bounceBalls; // main group of bouncers
    this.kickPlayers; // group of kick drum players
    this.snarePlayers;
    this.stringPlayers;
    this.ballScale = 0.25;
    this.catchFlag = false;
    this.launchVelocity = 0;

    var self = this;

    this.panVol = new Tone.PanVol(0.5, -18);
    var urls = ["./assets/samples/kick_mix_1.mp3",
                "./assets/samples/snare_mix_1.mp3",
                "./assets/samples/chh_mixed_1.mp3", "./assets/samples/ohh_mixed_1.mp3"];

    this.samplesLoaded = function() {
        this.loaded++;
        console.log("Num samples loaded: " + this.loaded);
    }
    //var self = this;
    this.drumPlayer1 = new Tone.MultiPlayer(urls, (this.samplesLoaded).bind(this));

    this.drumPlayer2 = new Tone.MultiPlayer(urls, (this.samplesLoaded).bind(this));

    var drumPlayer3 = new Tone.MultiPlayer(urls, (this.samplesLoaded).bind(this));

    var drumPlayer4 = new Tone.MultiPlayer(urls, (this.samplesLoaded).bind(this));

    var ohhSequence = new Tone.Sequence((function(time, note){
        drumPlayer3.start(3, time);
    }).bind(this), ["G4"], "1n");
    //ohhSequence.start(0);

    //var ohhPart = [null, null, null, null, null, null, null, null];
    var chhSequence = new Tone.Sequence((function(time, note){
        drumPlayer4.start(2, time);
    }).bind(this), ["G4", "G4", "G4", "G4"], "4n");
    //chhSequence.start(0);

    this.drumPlayer1.connect(this.panVol);
    this.drumPlayer2.connect(this.panVol);

    //drumPlayer3.connect(this.panVol);
    //drumPlayer4.connect(this.panVol);

    this.panVol.connect(Tone.Master);
};

krungKrang.prototype = {
    preload: function() {
        //console.log("Pre-loading");
        game.load.image('ball', 'assets/bubble256.png');
        game.load.image('blue_ball', 'assets/blue_ball.png');
        game.load.image('brick', 'assets/brick0.png');
        game.load.image('analog', 'assets/fusia.png');
        game.load.image('arrow', 'assets/arrow.png');
        game.load.spritesheet('playpausebutton', 'assets/pause_play_reset.png', 148, 80);
    },

    create: function() {

        // Debug:
        vertHalfLine = new Phaser.Line(game.world.width/2, 0, game.world.width/2, game.world.height);
        horHalfLine = new Phaser.Line(0, game.world.height/2, game.world.width, game.world.height/2);

        this.bounceBalls = game.add.group();
        this.kickPlayers = game.add.group();
        this.snarePlayers = game.add.group();
        //this.tally++;
        //console.log("Create drumPlayer tally: " + this.tally);
        game.stage.backgroundColor = "#303f9f";
        game.physics.startSystem(Phaser.Physics.ARCADE);
        var x = game.world.width/2;
        var y = game.world.height/2;
        bounceBall = this.bounceBalls.create(x, y, 'ball');
        game.physics.enable(bounceBall, Phaser.Physics.ARCADE);
        bounceBall.scale.set(this.ballScale);
        bounceBall.anchor.setTo(0.5, 0.5);
        bounceBall.body.collideWorldBounds = true;
        bounceBall.body.velocity.setTo(200, 200);
        bounceBall.body.bounce.setTo(1, 1);
        bounceBall.inputEnabled = true;
        bounceBall.input.enableDrag();

        //player.input.start(0, true);
        bounceBall.events.onInputDown.add(this.set);
        bounceBall.events.onInputUp.add(this.launch);

        analog = game.add.sprite(200, 450, 'analog');
        analog.width = 8;
        analog.rotation = 220;
        analog.alpha = 0;
        analog.anchor.setTo(0.5, 0.0);

        arrow = game.add.sprite(200, 450, 'arrow');
        arrow.anchor.setTo(0.1, 0.5);
        arrow.alpha = 0;


        // create some kick player obstacles
        for (var i = 0; i < 8; i++) {
            var x = game.rnd.integerInRange(0, game.world.width);
            var y = game.rnd.integerInRange(0, game.world.height);

            var kickPlayer = this.kickPlayers.create(x, y, 'brick');
            game.physics.enable(kickPlayer, Phaser.Physics.ARCADE);
            kickPlayer.body.bounce.setTo(1, 1);
            kickPlayer.body.immovable = true;
            kickPlayer.inputEnabled = true;
            kickPlayer.input.enableDrag();

            x = game.rnd.integerInRange(0, game.world.width);
            y = game.rnd.integerInRange(0, game.world.height);
            var snarePlayer = this.snarePlayers.create(x, y, 'blue_ball');
            game.physics.enable(snarePlayer, Phaser.Physics.ARCADE);
            snarePlayer.body.bounce.setTo(1, 1);
            snarePlayer.body.immovable = true;
            snarePlayer.inputEnabled = true;
            snarePlayer.input.enableDrag();

        }

    },

    update: function() {
        game.physics.arcade.collide(this.bounceBalls, this.kickPlayers,
                                    this.playKick, null, this);

        game.physics.arcade.collide(this.bounceBalls, this.snarePlayers,
                                    this.snareKick, null, this);

        arrow.rotation = game.physics.arcade.angleBetween(arrow, bounceBall);

            if (this.catchFlag == true)
            {
                //  Track the ball sprite to the mouse
                player.x = game.input.activePointer.worldX;
                player.y = game.input.activePointer.worldY;

                arrow.alpha = 1;
                analog.alpha = 0.5;
                analog.rotation = this.arrow.rotation - 3.14 / 2;
                analog.height = game.physics.arcade.distanceBetween(arrow, bounceBall);
                this.launchVelocity = analog.height;
            }

    },

    // render: function() {
    //      game.debug.geom(vertHalfLine, 'rgba(255,0,0,1)');
    //      game.debug.geom(horHalfLine, 'rgba(255,0,0,1)');
    //      game.debug.text("x body" + this.bubbles.children[0].body.x, 20, 20);
    //      game.debug.text("x sprite" + this.bubbles.children[0].x, 20, 40);
    // },

    set: function(ball, pointer) {

        this.catchFlag = true;
        //game.camera.follow(null);

        ball.body.moves = false;
        ball.body.velocity.setTo(0, 0);
        arrow.reset(ball.x, ball.y);
        analog.reset(ball.x, ball.y);

    },

    launch: function(ball, pointer) {
        this.catchFlag = false;
        ball.body.moves = true;
        //game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN);

        arrow.alpha = 0;
        analog.alpha = 0;

        var Xvector = (this.arrow.x - ball.x) * 3;
        var Yvector = (this.arrow.y - ball.y) * 3;

        ball.body.velocity.setTo(Xvector, Yvector);
    },

    onDragStart: function(bubble, pointer) {


    },

    onDragStop: function(sprite, pointer) {


    },

    playKick: function(bounceBall, kickPlayer) {
        //console.log("Kick player collision");
        this.drumPlayer1.start(0, "@8n");
    },

    snareKick: function(bounceBall, snarePlayer) {
        console.log("Snare player collision");
        this.drumPlayer2.start(1, "@8n");
    }

}
