

var xDown;
var yDown;

krungKrang = function(game) {
    this.bounceBalls; // main group of bouncers
    this.kickPlayers; // group of kick drum players
    this.snarePlayers;
    this.stringPlayers;
    this.ballScale = 0.25;
    //this.catchFlag = false;
    this.launchVelocity = 0;
    this.pitchedSampleLoaded = false;
    this.numLoaded = 0;
    this.drumSamplesLoaded = false;

    this.lowestOctave = 4;
    this.pitchRange = 2; // number of octaves
    this.pitches = []; // main array for pitch data on y axis

    var allPitches = game.tonalEnv.getFullChordArray(1, 7, []);
    var lowestPitch = game.tonalEnv.key + (this.lowestOctave * 12);
    this.pitches = game.tonalEnv.trimArray(allPitches, lowestPitch, lowestPitch + (this.pitchRange * 12));

    this.panVol = new Tone.PanVol(0.5, -12);
    this.pitchPanVol = new Tone.PanVol(0.5, -12);

    var urls = ["./assets/samples/kick_mix_1.mp3",
                "./assets/samples/snare_mix_1.mp3",
                "./assets/samples/chh_mixed_1.mp3", "./assets/samples/ohh_mixed_1.mp3"];

    this.samplesLoaded = function() {
        this.numLoaded++;
        console.log("Num samples loaded: " + this.numLoaded);
        if (this.numLoaded == 4) {
            this.drumSamplesLoaded = true;
        }
    }

    this.drumPlayer1 = new Tone.MultiPlayer(urls, (this.samplesLoaded).bind(this));

    this.drumPlayer2 = new Tone.MultiPlayer(urls, (this.samplesLoaded).bind(this));

    var drumPlayer3 = new Tone.MultiPlayer(urls, (this.samplesLoaded).bind(this));

    var drumPlayer4 = new Tone.MultiPlayer(urls, (this.samplesLoaded).bind(this));

    this.pitchPlayer = new Tone.Sampler("./assets/samples/bass.wav", (function(){
        this.pitchedSampleLoaded = true;
        console.log("Bass loaded");
    }).bind(this));

    this.sampleBase = Tone.Frequency("C4").toMidi();

    var chordProgPart = new Tone.Part((function(time, value) {

        console.log("chordProg ping at " + Tone.Transport.position);
        var allNotes = game.tonalEnv.getFullChordArray(value.root, value.tochordtone, value.alterations);
        var lowestPitch = allNotes[0] + (this.lowestOctave * 12);
        var prevPitches = this.pitches;
        this.pitches = game.tonalEnv.trimArray(allNotes, lowestPitch, lowestPitch + (this.pitchRange * 12));
        console.log("chord change " + this.pitches);

    }).bind(this), game.chordProgression.prog);

    chordProgPart.loop = true;
    chordProgPart.loopEnd = game.chordProgression.prog.length + "m";
    chordProgPart.start(0);

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
    this.pitchPlayer.connect(this.pitchPanVol);
    //drumPlayer3.connect(this.panVol);
    //drumPlayer4.connect(this.panVol);

    this.panVol.connect(Tone.Master);
    this.pitchPanVol.connect(Tone.Master);

};

krungKrang.prototype = {
    preload: function() {
        //console.log("Pre-loading");
        game.load.image('ball', 'assets/bubble256.png');
        game.load.image('blue_ball', 'assets/blue_ball.png');
        game.load.image('brick', 'assets/brick0.png');
        game.load.image('analog', 'assets/fusia.png');
        game.load.image('arrow', 'assets/arrow.png');
        game.load.image('string', 'assets/river.png');
        game.load.spritesheet('playpausebutton', 'assets/pause_play_reset.png', 148, 80);
    },

    create: function() {

        // Debug:
        vertHalfLine = new Phaser.Line(game.world.width/2, 0, game.world.width/2, game.world.height);
        horHalfLine = new Phaser.Line(0, game.world.height/2, game.world.width, game.world.height/2);

        this.bounceBalls = game.add.group();
        this.kickPlayers = game.add.group();
        this.snarePlayers = game.add.group();
        this.stringPlayers = game.add.group();
        //this.tally++;
        //console.log("Create drumPlayer tally: " + this.tally);
        game.stage.backgroundColor = "#303f9f";
        game.physics.startSystem(Phaser.Physics.ARCADE);

        for (var i = 0; i < 2; i++){
            var x = game.world.width/2;
            var y = game.world.height/2;
            var bounceBall = this.bounceBalls.create(x, y, 'ball');
            game.physics.enable(bounceBall, Phaser.Physics.ARCADE);
            bounceBall.scale.set(this.ballScale);
            bounceBall.anchor.setTo(0.5, 0.5);
            bounceBall.body.collideWorldBounds = true;
            x = game.rnd.integerInRange(-300, 300);
            y = game.rnd.integerInRange(-300, 300);
            bounceBall.body.velocity.setTo(x, y);
            bounceBall.body.bounce.setTo(1, 1);
            bounceBall.inputEnabled = true;
            bounceBall.input.enableDrag();
            //player.input.start(0, true);
            bounceBall.events.onDragStart.add(this.grab, this);
            bounceBall.events.onDragStop.add(this.flick, this);

        }

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

            x = game.rnd.integerInRange(0, game.world.width);
            y = game.rnd.integerInRange(0, game.world.height);
            var stringPlayer = this.stringPlayers.create(x, y, 'string');
            game.physics.enable(stringPlayer, Phaser.Physics.ARCADE);
            stringPlayer.inputEnabled = true;
            stringPlayer.input.enableDrag();
//            stringPlayer.scale.set(0.5);
            stringPlayer.scale.setTo(0.5, 0.2);
        }

    },

    update: function() {
        game.physics.arcade.collide(this.bounceBalls, this.kickPlayers,
                                    this.playKick, null, this);

        game.physics.arcade.collide(this.bounceBalls, this.snarePlayers,
                                    this.snareKick, null, this);

        game.physics.arcade.overlap(this.bounceBalls, this.stringPlayers,
                                    this.playString, null, this);

    },

    // render: function() {
    //      game.debug.geom(vertHalfLine, 'rgba(255,0,0,1)');
    //      game.debug.geom(horHalfLine, 'rgba(255,0,0,1)');
    //      game.debug.text("x body" + this.bubbles.children[0].body.x, 20, 20);
    //      game.debug.text("x sprite" + this.bubbles.children[0].x, 20, 40);
    // },

    grab: function(ball, pointer) {
        xDown = pointer.x;
        yDown = pointer.y;

        ball.body.velocity.x = 0;
        ball.body.velocity.y = 0;

    },

    flick: function(ball, pointer) {

        var dragTime = pointer.timeUp - pointer.timeDown;
        var deltaX = pointer.x - xDown;
        var deltaY = pointer.y - yDown;
        var velocityX = deltaX/dragTime * 1000;
        var velocityY = deltaY/dragTime * 1000;
        //result[2] = "velocity X: " + velocityX + " and velocity Y: " + velocityY;
        ball.body.velocity.x = velocityX;
        ball.body.velocity.y = velocityY;

    },

    playKick: function(bounceBall, kickPlayer) {
        //console.log("Kick player collision");
        if (this.drumSamplesLoaded == true) {
            this.drumPlayer1.start(0, "@8n");
        }

    },

    snareKick: function(bounceBall, snarePlayer) {
        //console.log("Snare player collision");
        if (this.drumSamplesLoaded == true) {
            this.drumPlayer2.start(1, "@8n");
        }
    },

    playString: function(bounceBall, string) {
        console.log("String overlap");
        var pitchIndex = (Math.floor((game.world.height - bounceBall.y)/game.world.height * this.pitches.length));
        var interval = this.pitches[pitchIndex] - this.sampleBase;
        if (this.pitchedSampleLoaded == true) {
            this.pitchPlayer.triggerAttackRelease(interval, "4n", "@8n", 0.75);
        }

    }

}
