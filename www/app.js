
var startEvent = "DOMContentLoaded";
if(window.cordova){
    startEvent = "deviceready";
}
document.addEventListener(startEvent,function() {

    var plucky; // Main pitched synth
    var pluckyPanVol; // Panner and gain for plucky

    var kick;  // Sample player - kick sound

    var closedHat; // Metronome sample player
    var hatPart; // Metronome part

    var snare; // Sample player - snare
    var snarePanVol; // Panner and gain for snare

    var beatCount = 0; // number of beats/balls counter
    var beatTotal = 8; // number of balls to start with
    var notes = [];

    var kickPart;
    var snarePart;
    var polyPart;

    var tempo = 116;
    var scalestructure = [2,2,3,2,3];
    var key = "C";
    var scale;

    initMusic(); // FIXME - ugly; should be an object with properties

    // assuming 4 beats per bar for the moment
    var barHorVelocity = window.innerWidth/(60/tempo * 4);
    var barVertVelocity = window.innerHeight/(60/tempo * 4);

    var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update
    });

    var drumBalls;
    var pitchBalls;
    var vPaddle;
    var hPaddle;
    var cursors;
    var left = false;
    var right = false;

    function preload () {
        //game.load.image('logo', 'phaser.png');
        //game.load.image('sky', 'assets/underwater3.png');
        //game.load.spritesheet('rain', 'assets/rain.png', 17, 17);
        game.load.spritesheet('ball', 'assets/balls.png', 17, 17);
        game.load.image('paddle', 'assets/paddle.png');
        // game.load.image('ship', 'assets/ship.png');
        // game.load.image('bullet', 'assets/bullets.png');

        // game.load.spritesheet('buttonvertical', 'assets/button-vertical.png',64,64);
        // game.load.spritesheet('buttonhorizontal', 'assets/button-horizontal.png',96,64);
        // game.load.spritesheet('buttonfire', 'assets/button-round-a.png',96,96);
        // game.load.spritesheet('buttonmakeball', 'assets/button-round-b.png',96,96);

        //plucky.triggerAttack("C4");   // Test sound from Tone.js
    }

    function create () {

        game.stage.backgroundColor = "#4488AA";
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //game.physics.arcade.checkCollision.left = false;
        drumBalls = game.add.group();
        drumBalls.enableBody = true;
        drumBalls.physicsBodyType = Phaser.Physics.ARCADE;

        pitchBalls = game.add.group();
        pitchBalls.enableBody = true;
        pitchBalls.physicsBodyType = Phaser.Physics.ARCADE;

        vPaddle = game.add.sprite(16, window.innerHeight/2, 'paddle');
        vPaddle.anchor.set(0.5, 0.5);
        vPaddle.enableBody = true;

        game.physics.enable(vPaddle, Phaser.Physics.ARCADE);
        vPaddle.body.collideWorldBounds = true;
        vPaddle.body.immovable = true;
        vPaddle.scale.setTo(2,2);

        hPaddle = game.add.sprite(window.innerWidth/2, window.innerHeight - 8, 'paddle');
        hPaddle.scale.setTo(12,0.5);
        hPaddle.anchor.set(0.5, 0.5);
        hPaddle.enableBody = true;
        game.physics.enable(hPaddle, Phaser.Physics.ARCADE);
        hPaddle.body.collideWorldBounds = true;
        hPaddle.body.immovable = true;

        cursors = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
        keyAddHBall = game.input.keyboard.addKey(Phaser.Keyboard.ONE);

        keyAddHBall.onDown.add(makeDrumBall, this);

        keyAddVBall = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        keyAddVBall.onDown.add(makePitchBall, this);

    }
    function update() {

        game.physics.arcade.collide(vPaddle, drumBalls, paddleHit, null, this);
        game.physics.arcade.collide(drumBalls, drumBalls, ballsHit, null, this);

        game.input.enabled = true;
        if (cursors.up.isDown)
        {
            vPaddle.body.velocity.y = -800;
        } else if (cursors.down.isDown)
        {
            vPaddle.body.velocity.y = 800;
        } else {
            vPaddle.body.velocity.y = 0;
        }

    }

    function ballsHit(ball1, ball2) {
        if (ball1.instrument == "snare" && ball2.instrument == "snare"){
            snare.start("@16n");

        } else if (ball1.instrument == "kick" && ball2.instrument == "kick"){
            kick.start("@16n");

        } else {
            console.log("different balls");

        }

    }

    function paddleHit(paddle, ball){

        // Use paddle to bounce ball back:
        // if (ball.y < (paddle.y - paddle.height/4)) {
        //     ball.body.velocity.y = -10 * (paddle.y - ball.y);
        // } else if (ball.y > (paddle.y + paddle.height/4)) {
        //     ball.body.velocity.y = 10 * (ball.y - paddle.y);
        // }

        // Use paddle as a ball destroyer:
        ball.destroy();

    }

    function ballOut(beatBall) {
        console.log("Beat out");

    }

    function makeDrumBall() {

        var ball = drumBalls.create(window.innerWidth, vPaddle.y, 'ball');
        ball.checkWorldBounds = true;
        ball.body.collideWorldBounds = true;
        ball.body.bounce.setTo(1,1);

        ball.body.velocity.x = -barHorVelocity;
        if (vPaddle.y < window.innerHeight/2) {
            ball.instrument = "snare";
            ball.frame = 1;
        } else {
            ball.instrument = "kick";
            ball.frame = 2;
        }
    }

    function makePitchBall() {

        var ball = pitchBalls.create(hPaddle.x, window.innerHeight,  'ball');
        ball.checkWorldBounds = true;
        ball.body.collideWorldBounds = true;
        ball.body.bounce.setTo(1,1);
        ball.body.velocity.y = -barVertVelocity;

    }

    function initMusic() {

        plucky = new Tone.MonoSynth();
        //plucky = new Tone.PolySynth(3, Tone.MonoSynth).toMaster();
        pluckyPanVol = new Tone.PanVol(0.5, -18);
        plucky.connect(pluckyPanVol);
        pluckyPanVol.connect(Tone.Master);

        kick = new Tone.Player("assets/kick_mix_1.wav",                 sampleLoaded).toMaster();
        kick.retrigger = true;

        // Using a closed high hat as metronome
        closedHat = new Tone.Player("assets/chh_mixed_1.wav", sampleLoaded).toMaster();
        closedHat.retrigger = true;
        hatPart = new Tone.Part(function(time, note) {
            closedHat.start();
        }, [["0:0", "C3"],["0:1", "C3"],["0:2", "C3"],["0:3", "C3"]]);
        hatPart.loop = true;
        hatPart.length = 1;
        hatPart.loopEnd = "1m";

        snare = new Tone.Player("assets/snare_mix_1.wav", sampleLoaded);
        snarePanVol = new Tone.PanVol(0.5, -12);
        snare.connect(snarePanVol);
        snarePanVol.connect(Tone.Master);
        snare.retrigger = true;

        kickPart = new Tone.Part(function(time, note) {
            kick.start();
        }, notes);

        kickPart.loop = true;
        kickPart.length = 1;
        kickPart.loopEnd = "1m";
        kickPart.start(0);

        snarePart = new Tone.Part(function(time, note) {
            snare.start();
        }, notes);

        snarePart.loop = true;
        snarePart.length = 1;
        snarePart.loopEnd = "1m";
        snarePart.start(0);

        polyPart = new Tone.Part(function(time, note) {
            plucky.triggerAttackRelease(note, "16n", time);
        }, notes);
        polyPart.loop = true;
        polyPart.length = 1;
        polyPart.loopEnd = "1m";
        polyPart.start(0);

        var samplesLoaded = false;
        var numSamplesLoaded = 0;
        function sampleLoaded() {
            numSamplesLoaded++;
            if (numSamplesLoaded == 3) {
                samplesLoaded = true;
                console.log("Samples loaded");
                Tone.Transport.start();
                hatPart.start(); // has events in it from init
            }
        }


        Tone.Transport.loop = false;
        Tone.Transport.bpm.value = tempo;

        scale = setScale(key);

        function setScale(key) {
            var pitch = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
            var _scale = [];
            var start = pitch.indexOf(key);
            _scale.push(pitch[start]);
            var prevnoteindex = start;
            for (i = 0; i < scalestructure.length - 1; i++) {
                nextnoteindex = prevnoteindex + scalestructure[i];
                if (nextnoteindex >= pitch.length) {
                    nextnoteindex = nextnoteindex - pitch.length; // wrap
                }
                _scale.push(pitch[nextnoteindex]);
                prevnoteindex = nextnoteindex;
            }
            //this.scale = scale;
            return _scale
        }


    }

});
