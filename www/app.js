
var startEvent = "DOMContentLoaded";
if(window.cordova){
    startEvent = "deviceready";
}
document.addEventListener(startEvent,function() {


});
var deviceWidth = window.innerWidth;// * window.devicePixelRatio;
var deviceHeight = window.innerHeight;// * window.devicePixelRatio;

var game = new Phaser.Game(deviceWidth, deviceHeight * 0.85, Phaser.AUTO, 'stage', {
    preload: preload, create: create, update: update });

var tonalEnv = new Tonality();
var plucky; // Main pitched synth
var pluckyPanVol; // Panner and gain for plucky

var bassSynth;
var bassPanVol;

var kick;  // Sample player - kick sound
var kickPanVol;

var closedHat; // Metronome sample player
var closedHatPanVol;
var hatPart; // Metronome part

var chordProgPart;
var bassPart;
var bassArpeggio;

var snare; // Sample player - snare
var snareSampler;
var snarePanVol; // Panner and gain for snare

var beatCount = 0; // number of beats/balls counter
var beatTotal = 8; // number of balls to start with
var notes = [];

//var kickPart;
//var snarePart;
//var polyPart;

var tempo = 116;
//var scalestructure = [4,3,3,2];
//var key = "C";
//var scale;

initMusic(); // FIXME - ugly; should be an object with properties

    // assuming 4 beats per bar for the moment
var barHorVelocity = game.width/(60/tempo * 4);
var barVertVelocity = game.height/(60/tempo * 4);

// var game = new Phaser.Game(game.width, window.innerHeight, Phaser.AUTO, '', {
//     preload: preload,
//     create: create,
//     update: update
// });

var drumBalls;
var pitchBalls;
var vPaddle;
//var hPaddle;
var cursors;
var thumbStick;
var horBallButton;
var vertBallButton;
var left = false;
var right = false;
var up = false;
var down = false;
var isPaused = true;
var gameOver = false;

var cubeScaleHeight = 1;
var cubeScaleWidth = cubeScaleHeight * 4;

function preload () {

    game.load.spritesheet('ball', 'assets/balls.png', 17, 17);
    game.load.image('paddle', 'assets/paddle.png');

    game.load.spritesheet('buttonvertical', 'assets/button-vertical.png',64,64);

    game.load.spritesheet('horballfire', 'assets/button-round-a.png', 96,96);
    game.load.spritesheet('vertballfire', 'assets/button-round-b.png', 96,96);
    game.load.spritesheet('playpausebutton', 'assets/pause_play_reset.png', 148, 80);


}

function create () {
    var self = this;
    game.stage.backgroundColor = "#4488AA";
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //game.physics.arcade.checkCollision.left = false;
    drumBalls = game.add.group();
    drumBalls.enableBody = true;
    drumBalls.physicsBodyType = Phaser.Physics.ARCADE;

    pitchBalls = game.add.group();
    pitchBalls.enableBody = true;
    pitchBalls.physicsBodyType = Phaser.Physics.ARCADE;

    vPaddle = game.add.sprite(16, game.height/2, 'paddle');
    vPaddle.anchor.set(0.5, 0.5);
    vPaddle.enableBody = true;

    game.physics.enable(vPaddle, Phaser.Physics.ARCADE);
    vPaddle.body.collideWorldBounds = true;
    vPaddle.body.immovable = true;
    vPaddle.scale.setTo(cubeScaleWidth,cubeScaleHeight);

    button = game.add.button(game.width - 148, game.height - 80,
         'playpausebutton', pauseGame, this, 1, 1, 1, 1);
    button.scale.setTo(0.75, 0.75);

    cursors = game.input.keyboard.createCursorKeys();

    keyAddVBall = game.input.keyboard.addKey(Phaser.Keyboard.TWO);

    buttonup = game.add.button(64, game.height - 192, 'buttonvertical',
            null, this, 0, 1, 0, 1);

    buttonup.fixedToCamera = true;
    buttonup.events.onInputOver.add(function(){up=true;});
    buttonup.events.onInputOut.add(function(){up=false;});
    buttonup.events.onInputDown.add(function(){up=true;});
    buttonup.events.onInputUp.add(function(){up=false;});

    buttonleft = game.add.button(0, game.height - 128, 'buttonvertical',
            null, this, 0, 1, 0, 1);
    buttonleft.fixedToCamera = true;
    buttonleft.events.onInputOver.add(function(){left=true;});
    buttonleft.events.onInputOut.add(function(){left=false;});
    buttonleft.events.onInputDown.add(function(){left=true;});
    buttonleft.events.onInputUp.add(function(){left=false;});

    buttonright = game.add.button(128, game.height - 128, 'buttonvertical',
            null, this, 0, 1, 0, 1);
    buttonright.fixedToCamera = true;
    buttonright.events.onInputOver.add(function(){right=true;});
    buttonright.events.onInputOut.add(function(){right=false;});
    buttonright.events.onInputDown.add(function(){right=true;});
    buttonright.events.onInputUp.add(function(){right=false;});

    buttondown = game.add.button(64, game.height - 64, 'buttonvertical',
            null, this, 0, 1, 0, 1);
    buttondown.fixedToCamera = true;
    buttondown.events.onInputOver.add(function(){down=true;});
    buttondown.events.onInputOut.add(function(){down=false;});
    buttondown.events.onInputDown.add(function(){down=true;});
    buttondown.events.onInputUp.add(function(){down=false;});

    //
    Tone.Transport.scheduleRepeat(function(time){
        if (drumBalls.children.length < 6){
            var horBallYpos = Math.floor(Math.random() * game.height);
            game.time.events.repeat(Phaser.Timer.SECOND * 0.5, 2, makeDrumBall, this, horBallYpos);
        }

    }, "2m");

    Tone.Transport.scheduleRepeat(function(time){
        if (pitchBalls.children.length < 12){
            var vertBallXpos = Math.floor(Math.random() * game.width);
            game.time.events.repeat(Phaser.Timer.SECOND * 0.5, 2, makePitchBall, this, vertBallXpos);
        }

    }, "2m");

}
function update() {
    if (!isPaused) {
        game.physics.arcade.collide(vPaddle, drumBalls, drumBallHit, null, this);
        game.physics.arcade.collide(vPaddle, pitchBalls, pitchBallHit, null, this);

        game.physics.arcade.collide(drumBalls, drumBalls, horBallsHit, null, this);
        game.physics.arcade.collide(pitchBalls, pitchBalls, vertBallsHit, null, this);

        game.input.enabled = true; // FIXME should this be here at all?

        if (cursors.up.isDown || up)
        {
            vPaddle.body.velocity.y = -400;
        } else if (cursors.down.isDown || down)
        {
            vPaddle.body.velocity.y = 400;
        } else {
            vPaddle.body.velocity.y = -100;
        }

        if (cursors.left.isDown || left)
        {
            vPaddle.body.velocity.x = -400;
        } else if (cursors.right.isDown || right)
        {
            vPaddle.body.velocity.x = 400;
        } else {
            vPaddle.body.velocity.x = 100;
        }
    }

}


/* Horizontal moving balls collision
*
*/
function horBallsHit(ball1, ball2) {
    if (ball1.instrument == "snare" && ball2.instrument == "snare"){
        //snareSampler.start("+@4n");
        var nowPos = Tone.Transport.position;
        //console.log("Transport pos: " + nowPos);
        var quantTime = Tone.TransportTime("@8n");
        //console.log("quantized 8n time: " + quantTime);
        quantPos = quantTime.toBarsBeatsSixteenths();
        //console.log("quantized 8n pos: " + quantPos);
        Tone.Transport.scheduleOnce(function(time){
            snareSampler.triggerAttackRelease(0, "16n", time);
            //console.log("playing at: " + Tone.Transport.position);
            //console.log("Time is: " + time);
        }, "@8n");

        //snarePart.at(Tone.TransportTime("@4n"), "C4");

    } else if (ball1.instrument == "kick" && ball2.instrument == "kick"){
        // Tone.Transport.schedule(function(time){
        //     kick.start(0);
        // }, "@8n");
        Tone.Transport.scheduleOnce(function(time){
            kick.triggerAttackRelease(0, "16n", time);
            //console.log("playing at: " + Tone.Transport.position);
            //console.log("Time is: " + time);
        }, "@8n");
        //kick.start("+@8n");
        //kick.start(Tone.TransportTime("@4n"));
        //kickPart.at(Tone.TransportTime("@4n"), "C4");

    }
}

function vertBallsHit(ball1, ball2){
    //console.log("vert balls collision");

    var scaled = ball1.body.y/game.height;
    //var note = note[scaled % scalestructure.length + 14]; // adjust for number of notes in scale
    var hitNote = notes[Math.floor(scaled * notes.length)];
    //console.log("hitNote is " + hitNote);
    var octave = Math.floor(scaled/20 * 4) + 2;  // 4 octaves to divide into
    var filterFreq = (ball1.body.x/game.width * 100);
    //    console.log("filterFreq: " + filterFreq);
    //plucky.filter.frequency.value = filterFreq;
    plucky.set({
        "filterEnvelope" : {
            "baseFrequency" : filterFreq
        }
    });

    Tone.Transport.scheduleOnce(function(time){
        //plucky.triggerAttackRelease(note + octave, "16n", time);
        plucky.triggerAttackRelease(Tone.Frequency(hitNote, "midi"), "16n", time);
    }, "@8n");

}

function drumBallHit(paddle, ball){

    // Use paddle to bounce ball back:
    // if (ball.y < (paddle.y - paddle.height/4)) {
    //     ball.body.velocity.y = -10 * (paddle.y - ball.y);
    // } else if (ball.y > (paddle.y + paddle.height/4)) {
    //     ball.body.velocity.y = 10 * (ball.y - paddle.y);
    // }

    // Use paddle as a ball destroyer:
    cubeScaleHeight = cubeScaleHeight * 1.2;
    vPaddle.scale.setTo(cubeScaleWidth,cubeScaleHeight);
    ball.destroy();
    if (vPaddle.height >= game.height) {
        Tone.Transport.stop();
        button.setFrames(2,2,2,2);
        gameOver = true;
    }

}

function pitchBallHit(paddle, ball){

    // Use paddle to bounce ball back:
    // if (ball.y < (paddle.y - paddle.height/4)) {
    //     ball.body.velocity.y = -10 * (paddle.y - ball.y);
    // } else if (ball.y > (paddle.y + paddle.height/4)) {
    //     ball.body.velocity.y = 10 * (ball.y - paddle.y);
    // }

    // Use paddle as a ball destroyer:
    cubeScaleWidth = cubeScaleWidth * 1.2;
    vPaddle.scale.setTo(cubeScaleWidth,cubeScaleHeight);
    ball.destroy();
    if (vPaddle.width >= game.width) {
        Tone.Transport.stop();
        button.setFrames(2,2,2,2);
        gameOver = true;
    }
}

function makeDrumBall(y) {


    var ball = drumBalls.create(game.width, y, 'ball');
    ball.checkWorldBounds = true;
    ball.body.collideWorldBounds = true;
    ball.body.bounce.setTo(1,1);

    ball.body.velocity.x = -barHorVelocity + (Math.random() * 200-100);
    ball.instrument = "snare";
    ball.frame = 1;
    // if (y < game.height/2) {
    //     ball.instrument = "snare";
    //     ball.frame = 1;
    // } else {
    //     ball.instrument = "kick";
    //     ball.frame = 2;
    // }
}

function makePitchBall(x) {

    var ball = pitchBalls.create(x, 0,  'ball');
    ball.checkWorldBounds = true;
    ball.body.collideWorldBounds = true;
    ball.body.bounce.setTo(1,1);
    ball.body.velocity.y = -barVertVelocity + ((Math.random() * 200-100));

}

function pauseGame() {
    if (gameOver == true) {
        // reset game
        // Get rid of existing balls
        drumBalls.removeChildren();
        pitchBalls.removeChildren();
        // return paddle to normal size and starting position
        cubeScaleWidth =  4;
        cubeScaleHeight = 1;
        vPaddle.scale.setTo(cubeScaleWidth,cubeScaleHeight);
        vPaddle.position.x = 16;
        vPaddle.position.y = game.height/2;
        Tone.Transport.start();
        button.setFrames(0,0,0,0);
        gameOver = false;

    }  else {
        if (isPaused == false) {
            //Tone.Transport.start("+0.1");
            button.setFrames(1,1,1,1);
            drumBalls.setAll('body.velocity.x', 0, false, false, 0 ,false);
            pitchBalls.setAll('body.velocity.y', 0, false, false, 0 ,false);
            vPaddle.body.velocity.x = 0;
            vPaddle.body.velocity.y = 0;
            Tone.Transport.pause();
            isPaused = true;
        }   else {

            drumBalls.forEach(setRandomX, this, true);
            pitchBalls.forEach(setRandomY, this, true);
            Tone.Transport.start("+0.1");
            button.setFrames(0,0,0,0);
            isPaused = false;
            function setRandomX(ball) {
                ball.body.velocity.x = -barHorVelocity + (Math.random() * 200 - 100);
            }
            function setRandomY(ball) {
                ball.body.velocity.y = -barVertVelocity + (Math.random() * 200 - 100);
            }
        }
    }

}


function initMusic() {

    //plucky = new Tone.MonoSynth();
    plucky = new Tone.PolySynth(3, Tone.MonoSynth);
    pluckyPanVol = new Tone.PanVol(0.5, -24);
    plucky.connect(pluckyPanVol);
    pluckyPanVol.connect(Tone.Master);

    bassSynth = new Tone.MonoSynth();
    bassPanVol = new Tone.PanVol(0.5, -24);
    bassSynth.connect(bassPanVol);
    bassPanVol.connect(Tone.Master);

    kick = new Tone.Sampler("assets/kick_mix_1.wav", sampleLoaded);
    kickPanVol = new Tone.PanVol(0.5, -9);
    //kick.retrigger = true;
    //kick.sync();
    kick.connect(kickPanVol);
    kickPanVol.connect(Tone.Master);
    kickPart = new Tone.Part(function(time, note) {
        kick.triggerAttackRelease(0, "8n", time);
    }, [["0:0", "C3"], ["0:1", "C3"], ["0:2", "C3"], ["0:3", "C3"],
        ["1:0", "C3"], ["1:2", "C3"], ["1:3", "C3"], ["1:3:2", "C3"]]
    );
    kickPart.loop = true;
    kickPart.loopEnd = "2m";

    // Using a closed high hat as metronome
    //closedHat = new Tone.Sampler("assets/chh_mixed_1.wav", sampleLoaded);
    closedHat = new Tone.Sampler("assets/chh_mixed_1.wav", sampleLoaded);
    closedHatPanVol = new Tone.PanVol(0.5, -15);
    //closedHat.sync();
    //closedHat.retrigger = true;
    closedHat.connect(closedHatPanVol);
    closedHatPanVol.connect(Tone.Master);

    hatPart = new Tone.Part(function(time, note) {
        closedHat.triggerAttackRelease(0, "16n", time);
    }, [["0:0", "C3"],["0:1", "C3"],["0:2", "C3"]]);
    hatPart.loop = true;
    hatPart.length = 1;
    hatPart.loopEnd = "1m";

    chordProgPart = new Tone.Part(function(time, value) {
        //console.log("chord change " + value);
        console.log("bar num " + Tone.Transport.position);
        var allNotes = tonalEnv.getFullChordArray(value.root, value.tochordtone, value.alterations);
        notes = tonalEnv.trimArray(allNotes, 36, 84);
        bassArpeggio = tonalEnv.scaleOctave(tonalEnv.getChord(value.root,
                                                              value.tochordtone, value.alterations), 3);
        for (var i = 0; i < bassArpeggio.length; i++) {
            //var time = "0:" + i;
            bassPart.at(i, bassArpeggio[i]);
        }
    }, [
        {time: "0m",
        root: 1,
        tochordtone: 7,
        alterations: [0,0,0,-1]},
        {time: "1m",
        root: 4,
        tochordtone: 7,
        alterations: [0,0,0,-1]},
        {time: "2m",
        root: 1,
        tochordtone: 7,
        alterations: [0,0,0,-1]},
        {time: "4m",
        root: 4,
        tochordtone: 7,
        alterations: [0,0,0,-1]},
        {time: "6m",
        root: 1,
        tochordtone: 7,
        alterations: [0,0,0,-1]},
        {time: "8m",
        root: 2,
        tochordtone: 7,
        alterations: [0,0,0,0]},
        {time: "9m",
        root: 5,
        tochordtone: 7,
        alterations: [0,0,0,0]},
        {time: "10m",
        root: 1,
        tochordtone: 7,
        alterations: [0,0,0,-1]},
        {time: "11m",
        root: 5,
        tochordtone: 7,
        alterations: [0,0,0,0]}

    ]);
    chordProgPart.loop = true;
    chordProgPart.loopEnd = "12m";

    bassArpeggio = tonalEnv.scaleOctave(tonalEnv.getChord(1, 7, []), 4);

    var bassPart = new Tone.Sequence(function(time, note){
    	//console.log(note);
        bassSynth.triggerAttackRelease(Tone.Frequency(note, "midi"), "8n", time);

    }, bassArpeggio, "4n");
    bassPart.loop = true;
    bassPart.loopEnd = "1m";

    snareSampler = new Tone.Sampler("assets/snare_mix_1.wav", sampleLoaded);
    snarePanVol = new Tone.PanVol(0.5, -15);

    snareSampler.connect(snarePanVol);
    snarePanVol.connect(Tone.Master);

    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = "12m";
    Tone.Transport.bpm.value = tempo;
    Tone.Transport.latencyHint = 'playback';
    //Tone.context.latencyHint = 3;

    // Puts out a regular stream of balls

    var samplesLoaded = false;
    var numSamplesLoaded = 0;
    function sampleLoaded() {
        numSamplesLoaded++;
        if (numSamplesLoaded == 3) {
            samplesLoaded = true;
            console.log("Samples loaded");
            chordProgPart.start(0);
            kickPart.start(0);
            bassPart.start(0)

        }
    }

    var allNotes = tonalEnv.getFullChordArray(1, 7, [0,0,0,-1]);
    notes = tonalEnv.trimArray(allNotes, 36, 84);


}

nx.onload = function(){
    nx.colorize("#1bd");

    toggle1.on('*', function(data){
        //console.log(data);
        if (data.value == 1){
            Tone.Transport.start("+0.1");
        } else {
            Tone.Transport.stop();
        }
    })

    // dial1.label = "bFreq";
    // dial1.on('*', function(data){
    //     console.log(data);
    //     var scaledFreq = data.value * 5000
    //     plucky.set({
    //         "filterEnvelope": {
    //             "baseFrequency": scaledFreq
    //         }
    //
    //     });
    // })
    // slider1.label = "Att";
    // slider1.on('*', function(data){
    //     console.log(data);
    //     plucky.set({
    //         "envelope": {
    //             "attack": data.value
    //         }
    //
    //     });
    // })
    // tabs1.options[0] = "sine";
    // tabs1.options[1] = "square";
    // tabs1.options[2] = "sawtooth";
    // tabs1.on('*', function(data){
    //     console.log(data);
    // })
}
