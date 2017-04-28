
var startEvent = "DOMContentLoaded";
if(window.cordova){
    startEvent = "deviceready";
}
document.addEventListener(startEvent,function() {

    var plucky = new Tone.MonoSynth().toMaster();
    //var plucky = new Tone.PolySynth(3, Tone.MonoSynth).toMaster();
    var kick = new Tone.Player("assets/kick_mix_1.wav",                 sampleLoaded).toMaster();
    kick.retrigger = true;
    var snare = new Tone.Player("assets/snare_mix_1.wav", sampleLoaded).toMaster();
    snare.retrigger = true;

    var notes = [];
    var kickPart = new Tone.Part(function(time, note) {
        kick.start();
    }, notes);

    kickPart.loop = true;
    kickPart.length = 1;
    kickPart.loopEnd = "1m";
    kickPart.start(0);

    var snarePart = new Tone.Part(function(time, note) {
        snare.start();
    }, notes);

    snarePart.loop = true;
    snarePart.length = 1;
    snarePart.loopEnd = "1m";
    snarePart.start(0);

    var polyPart = new Tone.Part(function(time, note) {
        plucky.triggerAttackRelease(note, "16n", time);
    }, notes);

    polyPart.loop = true;
    polyPart.length = 1;
    polyPart.loopEnd = "1m";
    polyPart.start(0);

    Tone.Transport.loop = false;
    Tone.Transport.bpm.value = 116;
    // Tone.Transport.scheduleRepeat(function(time){
    //     console.log("Ping...");
    //     // if the ship is moving, then play a note depending on
    //     // its y position; quantize to the nearest 8th note for now
    //     if (ship.body.velocity.y != 0) {
    //         var scaled = Math.round(20 - (ship.body.y/window.innerHeight * 20));
    //         var note = scale[scaled % 5]; // adjust for number of notes in scale
    //         var octave = Math.floor(scaled/20 * 4) + 2;  // 4 octaves to divide into
    //         var filterFreq = (ship.body.x/window.innerWidth * 100);
    //         console.log("filterFreq: " + filterFreq);
    //         //plucky.filter.frequency.value = filterFreq;
    //         plucky.set({
    //             "filterEnvelope" : {
    //                 "baseFrequency" : filterFreq
    //             }
    //         });
    //
    //         plucky.triggerAttackRelease(note + octave, "16n", "@8n", 0.3);
    //         console.log(note + octave);
    //         //console.log("ship y accel: " + ship.body.acceleration.y); // -200 to 200
    //         //var filterFreq = (ship.body.acceleration.x/window.innerWidth * 8000 +500);
    //         //console.log("filterFreq: " + filterFreq);
    //         //plucky.filter,frequency = filterFreq;
    //     }
    //
    // }, "8n");

    //var scalestructure = [2,2,1,2,2,2,1];
    var scalestructure = [2,2,3,2,3];
    var key = "C";
    var scale = setScale(key);

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

    var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update,
        render: render
    });
    var samplesLoaded = false;
    var numSamplesLoaded = 0;
    function sampleLoaded() {
        numSamplesLoaded++;
        if (numSamplesLoaded == 2) {
            samplesLoaded = true;
            console.log("Samples loaded");
        }
    }

    //var leftEmitter;
    //var beatEmitter;
    var drumBalls;

    var cursors;
    var left = false;
    var right = false;

    //var line = [];
    //var keyAlt;

    function preload () {
        //game.load.image('logo', 'phaser.png');
        //game.load.image('sky', 'assets/underwater3.png');
        //game.load.spritesheet('rain', 'assets/rain.png', 17, 17);
        game.load.spritesheet('balls', 'assets/balls.png', 17, 17);

        game.load.image('ship', 'assets/ship.png');
        game.load.image('bullet', 'assets/bullets.png');

        game.load.spritesheet('buttonvertical', 'assets/button-vertical.png',64,64);
        game.load.spritesheet('buttonhorizontal', 'assets/button-horizontal.png',96,64);
        game.load.spritesheet('buttonfire', 'assets/button-round-a.png',96,96);
        game.load.spritesheet('buttonmakeball', 'assets/button-round-b.png',96,96);

        //plucky.triggerAttack("C4");   // Test sound from Tone.js
    }

    function create () {

        game.stage.backgroundColor = "#4488AA";
        game.physics.startSystem(Phaser.Physics.ARCADE);
        drumBalls = game.add.group();
        drumBalls.enableBody = true;
        drumBalls.physicsBodyType = Phaser.Physics.ARCADE;
        //snareBalls = game.add.group();

        beatEmitter = game.add.emitter(game.world.width - 50, game.world.centerY - 200);
        beatEmitter.gravity = 0;
        beatEmitter.bounce.setTo(1, 1);
        beatEmitter.setXSpeed(-100, -200);
        beatEmitter.setYSpeed(-50, 50);
        beatEmitter.makeParticles('balls', 1, 24, true, true);

        // explode, lifespan, frequency, quantity
        beatEmitter.start(false, 0, 1000, 48);

        cursors = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
        //game.input.keyboard.addKeyCapture([ Phaser.Keyboard.ALT]);
        //keyAlt = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        //keyAlt.onDown.add(makeDrumBall, this);
        //game.input.keyboard.removeKeyCapture(Phaser.Keyboard.ONE);


        // Draw a grid

        //Tone.Transport.start();

    }
    function update() {

        //game.physics.arcade.collide(bullets, drumBalls, hitDrumBall, null, this);
        game.physics.arcade.collide(beatEmitter);

        game.input.enabled = true;
        if (cursors.up.isDown)
        {
            //game.physics.arcade.accelerationFromRotation(ship.rotation, 200, //ship.body.acceleration);
        }
        else
        {
            //ship.body.acceleration.set(0);
        }

    }

    function render() {


    }


});
