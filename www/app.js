
var startEvent = "DOMContentLoaded";
if(window.cordova){
    startEvent = "deviceready";
}
document.addEventListener(startEvent,function() {

    //var plucky = new Tone.PluckSynth().toMaster();
    var plucky = new Tone.PolySynth(3, Tone.MembraneSynth).toMaster();
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

    //var scalestructure = [2,2,1,2,2,2,1];
    var scalestructure = [2,2,3,2,3];
    var key = "E";
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
        update: update
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

    var leftEmitter;
    var rightEmitter;
    var ship;
    var cursors;

    Tone.Transport.loop = false;
    Tone.Transport.bpm.value = 116;
    Tone.Transport.scheduleRepeat(function(time){
        console.log("Ping...");
        for (var i = 0; i < leftEmitter.children.length; i++){
            var kidX = leftEmitter.children[i].x;
            console.log("Child " + i + " x: " + kidX);
        }
        leftEmitter.y = leftEmitter.y - 5;

    }, "1m");

    function preload () {
        //game.load.image('logo', 'phaser.png');
        game.load.image('sky', 'assets/underwater3.png');
        game.load.spritesheet('rain', 'assets/rain.png', 17, 17);
        game.load.spritesheet('balls', 'assets/balls.png', 17, 17);

        game.load.image('ship', 'assets/ship.png');

        //plucky.triggerAttack("C4");   // Test sound from Tone.js
    }

    function create () {


        game.physics.startSystem(Phaser.Physics.ARCADE);

        leftEmitter = game.add.emitter(50, game.world.centerY - 200);
        leftEmitter.gravity = 0;
        leftEmitter.bounce.setTo(1, 1);
        leftEmitter.setXSpeed(100, 200);
        leftEmitter.setYSpeed(-50, 50);
        leftEmitter.makeParticles('balls', 0, 8, true, true);

        rightEmitter = game.add.emitter(game.world.width - 50, game.world.centerY - 200);
        rightEmitter.gravity = 0;
        rightEmitter.bounce.setTo(1, 1);
        rightEmitter.setXSpeed(-100, -200);
        rightEmitter.setYSpeed(-50, 50);
        rightEmitter.makeParticles('balls', 1, 8, true, true);

        // explode, lifespan, frequency, quantity
        leftEmitter.start(false, 0, 40);
        rightEmitter.start(false, 0, 40);

        ship = game.add.sprite(400, 400, 'ship');
        game.physics.enable(ship, Phaser.Physics.ARCADE);
        ship.body.collideWorldBounds = true;
        ship.body.bounce.set(1);

        cursors = game.input.keyboard.createCursorKeys();

        Tone.Transport.start();

    }
    function update() {

        game.physics.arcade.collide(leftEmitter, rightEmitter, change, null, this);

        game.physics.arcade.collide(ship, leftEmitter, shipHitLeft, null, this);
        game.physics.arcade.collide(ship, rightEmitter, shipHitRight, null, this);

        if (cursors.left.isDown) {
            ship.body.velocity.x -= 4;
        } else if (cursors.right.isDown) {
            ship.body.velocity.x += 4;
        } else if (cursors.up.isDown) {
            ship.body.velocity.y -= 4;
        } else if (cursors.down.isDown) {
            ship.body.velocity.y += 4;
        }

    }

    function change(a, b) {
        var pitchDivision = scalestructure.length + 1;

        var beat = Math.round(a.position.x/window.innerWidth * 16);
        var pitchIndex = Math.round(a.position.y/window.innerHeight * pitchDivision * 3);
        //var pitch = a.position.y;
        var octave = Math.floor(pitchIndex/pitchDivision) + 3 ; // 3 8ves; starting 8ve 4
        //console.log("left collision x: " + leftParticle.x + " and beat is " + beat);
        //polyPart.at(beat + "n", pitch);
        var pitch = scale[pitchIndex % (pitchDivision - 1)] + octave;
        polyPart.at(beat + "n", pitch);
        plucky.triggerAttack(pitch, "@16n");

    }

    function shipHitLeft(sprite, leftParticle) {
        //console.log("Sprite " + sprite + " hit " + leftParticle);
        kick.start("@16n");
        // Use x coordinate to sort out where in the bar it will be placed
        var beat = Math.round(leftParticle.x/window.innerWidth * 16);
        console.log("left collision x: " + leftParticle.x + " and beat is " + beat);
        kickPart.at(beat + " * 16n", "C2");
        leftParticle.body.velocity.x = 0;
    }

    function shipHitRight(sprite, rightParticle) {
        //console.log("Sprite " + sprite + " hit " + rightParticle);
        snare.start("@16n");
        var beat = Math.round(rightParticle.x/window.innerWidth * 16);
        console.log("right collision x: " + rightParticle.x + " and beat is " + beat);
        snarePart.at(beat + "n", "C2");
    }
});
