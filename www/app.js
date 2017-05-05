
var startEvent = "DOMContentLoaded";
if(window.cordova){
    startEvent = "deviceready";
}
document.addEventListener(startEvent,function() {


});

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'stage', {
    preload: preload, create: create, update: update });

var plucky; // Main pitched synth
var pluckyPanVol; // Panner and gain for plucky

var kick;  // Sample player - kick sound
var kickPanVol;

var closedHat; // Metronome sample player
var closedHatPanVol;
var hatPart; // Metronome part

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
var scalestructure = [4,3,3,2];
var key = "C";
var scale;

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
var hPaddle;
var cursors;
var thumbStick;
var horBallButton;
var vertBallButton;
var left = false;
var right = false;
var up = false;
var down = false;

function preload () {

    game.load.spritesheet('ball', 'assets/balls.png', 17, 17);
    game.load.image('paddle', 'assets/paddle.png');

    game.load.spritesheet('buttonvertical', 'assets/button-vertical.png',64,64);

    game.load.spritesheet('horballfire', 'assets/button-round-a.png', 96,96);
    game.load.spritesheet('vertballfire', 'assets/button-round-b.png', 96,96);


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

    vPaddle = game.add.sprite(16, game.height/2, 'paddle');
    vPaddle.anchor.set(0.5, 0.5);
    vPaddle.enableBody = true;

    game.physics.enable(vPaddle, Phaser.Physics.ARCADE);
    vPaddle.body.collideWorldBounds = true;
    vPaddle.body.immovable = true;
    vPaddle.scale.setTo(2,2);

    hPaddle = game.add.sprite(game.width/2, game.height - 8, 'paddle');
    hPaddle.scale.setTo(12,0.5);
    hPaddle.anchor.set(0.5, 0.5);
    hPaddle.enableBody = true;
    game.physics.enable(hPaddle, Phaser.Physics.ARCADE);
    hPaddle.body.collideWorldBounds = true;
    hPaddle.body.immovable = true;

    cursors = game.input.keyboard.createCursorKeys();
    //game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    keyAddHBall = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    keyAddHBall.onDown.add(makeDrumBall, this);

    keyAddVBall = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    keyAddVBall.onDown.add(makePitchBall, this);


    buttonup = game.add.button(64, game.height - 192, 'buttonvertical', null, this, 0, 1, 0, 1);
    buttonup.fixedToCamera = true;
    buttonup.events.onInputOver.add(function(){up=true;});
    buttonup.events.onInputOut.add(function(){up=false;});
    buttonup.events.onInputDown.add(function(){up=true;});
    buttonup.events.onInputUp.add(function(){up=false;});

    buttonleft = game.add.button(0, game.height - 128, 'buttonvertical', null, this, 0, 1, 0, 1);
    buttonleft.fixedToCamera = true;
    buttonleft.events.onInputOver.add(function(){left=true;});
    buttonleft.events.onInputOut.add(function(){left=false;});
    buttonleft.events.onInputDown.add(function(){left=true;});
    buttonleft.events.onInputUp.add(function(){left=false;});

    buttonright = game.add.button(128, game.height - 128, 'buttonvertical', null, this, 0, 1, 0, 1);
    buttonright.fixedToCamera = true;
    buttonright.events.onInputOver.add(function(){right=true;});
    buttonright.events.onInputOut.add(function(){right=false;});            buttonright.events.onInputDown.add(function(){right=true;});           buttonright.events.onInputUp.add(function(){right=false;});

    buttondown = game.add.button(64, game.height - 64, 'buttonvertical', null, this, 0, 1, 0, 1);
    buttondown.fixedToCamera = true;
    buttondown.events.onInputOver.add(function(){down=true;});
    buttondown.events.onInputOut.add(function(){down=false;});
    buttondown.events.onInputDown.add(function(){down=true;});
    buttondown.events.onInputUp.add(function(){down=false;});

    //thumbStick.events.onInputUp.add(function(){left=false;});


    horBallButton = game.add.button(game.width - (96*2), game.height - 96, 'horballfire', null, this, 0, 1, 0, 1);
    horBallButton.fixedToCamera = true;
    //buttonfire.events.onInputOver.add(function(){fire=true;});
    //buttonfire.events.onInputOut.add(function(){fire=false;});
    horBallButton.events.onInputDown.add(function(){
        makeDrumBall();
    });
    //buttonfire.events.onInputUp.add(function(){fire=false;}
    vertBallButton = game.add.button(game.width - 96, game.height - 96, 'vertballfire', null, this, 0, 1, 0, 1);
    vertBallButton.fixedToCamera = true;
    //buttonfire.events.onInputOver.add(function(){fire=true;});
    //buttonfire.events.onInputOut.add(function(){fire=false;});
    vertBallButton.events.onInputDown.add(function(){
        makePitchBall();
    });

}
function update() {

    game.physics.arcade.collide(vPaddle, drumBalls, paddleHit, null, this);
    game.physics.arcade.collide(hPaddle, pitchBalls, paddleHit, null, this);

    game.physics.arcade.collide(drumBalls, drumBalls, horBallsHit, null, this);
    game.physics.arcade.collide(pitchBalls, pitchBalls, vertBallsHit, null, this);


    game.input.enabled = true;

    if (cursors.up.isDown || up)
    {
        vPaddle.body.velocity.y = -800;
    } else if (cursors.down.isDown || down)
    {
        vPaddle.body.velocity.y = 800;
    } else {
        vPaddle.body.velocity.y = 0;
    }

    if (cursors.left.isDown || left)
    {
        hPaddle.body.velocity.x = -800;
    } else if (cursors.right.isDown || right)
    {
        hPaddle.body.velocity.x = 800;
    } else {
        hPaddle.body.velocity.x = 0;
    }

}

/* Horizontal moving balls collision
*
*/
function horBallsHit(ball1, ball2) {
    if (ball1.instrument == "snare" && ball2.instrument == "snare"){
        //snareSampler.start("+@4n");
        var nowPos = Tone.Transport.position;
        console.log("Transport pos: " + nowPos);
        var quantTime = Tone.TransportTime("@8n");
        console.log("quantized 8n time: " + quantTime);
        quantPos = quantTime.toBarsBeatsSixteenths();
        console.log("quantized 8n pos: " + quantPos);
        Tone.Transport.scheduleOnce(function(time){
            snareSampler.triggerAttackRelease(0, "16n", time);
            console.log("playing at: " + Tone.Transport.position);
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

    var scaled = Math.round(20 - (ball1.body.y/game.height * 20));
    var note = scale[scaled % scalestructure.length]; // adjust for number of notes in scale
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
        plucky.triggerAttackRelease(note + octave, "16n", time);
    }, "@8n");
    //    console.log(note + octave);
    //console.log("ship y accel: " + ship.body.acceleration.y); // -200 to 200
    //var filterFreq = (ship.body.acceleration.x/window.innerWidth * 8000 +500);
    //console.log("filterFreq: " + filterFreq);
    //plucky.filter,frequency = filterFreq;


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

    var ball = drumBalls.create(game.width, vPaddle.y, 'ball');
    ball.checkWorldBounds = true;
    ball.body.collideWorldBounds = true;
    ball.body.bounce.setTo(1,1);

    ball.body.velocity.x = -barHorVelocity + (Math.random() * 200-100);
    if (vPaddle.y < game.height/2) {
        ball.instrument = "snare";
        ball.frame = 1;
    } else {
        ball.instrument = "kick";
        ball.frame = 2;
    }
}

function makePitchBall() {

    var ball = pitchBalls.create(hPaddle.x, 0,  'ball');
    ball.checkWorldBounds = true;
    ball.body.collideWorldBounds = true;
    ball.body.bounce.setTo(1,1);
    ball.body.velocity.y = -barVertVelocity * (hPaddle.x / game.width) * 2 +  (Math.random() * 200);

}

function initMusic() {

    //plucky = new Tone.MonoSynth();
    plucky = new Tone.PolySynth(3, Tone.MonoSynth);
    pluckyPanVol = new Tone.PanVol(0.5, -18);
    plucky.connect(pluckyPanVol);
    pluckyPanVol.connect(Tone.Master);

    kick = new Tone.Sampler("assets/kick_mix_1.wav", sampleLoaded);
    kickPanVol = new Tone.PanVol(0.5, -6);
    //kick.retrigger = true;
    //kick.sync();
    kick.connect(kickPanVol);
    kickPanVol.connect(Tone.Master);

    // Using a closed high hat as metronome
    //closedHat = new Tone.Sampler("assets/chh_mixed_1.wav", sampleLoaded);
    closedHat = new Tone.Sampler("assets/chh_mixed_1.wav", sampleLoaded);
    closedHatPanVol = new Tone.PanVol(0.5, -12);
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

    //snare = new Tone.Player("assets/snare_mix_1.wav", sampleLoaded);
    snareSampler = new Tone.Sampler("assets/snare_mix_1.wav", sampleLoaded);
    snarePanVol = new Tone.PanVol(0.5, -12);
    //snareSampler.sync();
    //snareSampler.retrigger = true;
    //snare.connect(snarePanVol);
    snareSampler.connect(snarePanVol);
    snarePanVol.connect(Tone.Master);

    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = "1m";
    Tone.Transport.bpm.value = tempo;
    Tone.context.latencyHint = 'playback';
    //Tone.context.latencyHint = 3;

    var samplesLoaded = false;
    var numSamplesLoaded = 0;
    function sampleLoaded() {
        numSamplesLoaded++;
        if (numSamplesLoaded == 3) {
            samplesLoaded = true;
            console.log("Samples loaded");

            hatPart.start(0); // has events in it from init
            //kickPart.start(0);
            //snarePart.start(0);
            //polyPart.start(0);
            Tone.Transport.start("+0.1");

        }
    }


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

nx.onload = function(){
    nx.colorize("#1bd");
    dial1.label = "bFreq";
    dial1.on('*', function(data){
        console.log(data);
        var scaledFreq = data.value * 5000
        plucky.set({
            "filterEnvelope": {
                "baseFrequency": scaledFreq
            }

        });
    })
    slider1.label = "Att";
    slider1.on('*', function(data){
        console.log(data);
        plucky.set({
            "envelope": {
                "attack": data.value
            }

        });
    })
    tabs1.options[0] = "sine";
    tabs1.options[1] = "square";
    tabs1.options[2] = "sawtooth";
    tabs1.on('*', function(data){
        console.log(data);
    })
}
