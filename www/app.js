
var startEvent = "DOMContentLoaded";
if(window.cordova){
    startEvent = "deviceready";
}
document.addEventListener(startEvent,function() {


});

var deviceWidth = window.innerWidth;// * window.devicePixelRatio;
var deviceHeight = window.innerHeight;// * window.devicePixelRatio;
var bubbles;
var isPaused = true;
var button;
var resetButton;

var tonalEnv;
var notes = [];
//var chordProgPart;

var game = new Phaser.Game(deviceWidth, deviceHeight, Phaser.AUTO, 'stage', {preload: preload, create: create, update: update });

//var tonalEnv = new Tonality();


function preload () {
    game.load.image('bubble', 'assets/bubble256.png');
    game.load.spritesheet('playpausebutton', 'assets/pause_play_reset.png', 148, 80);
}

function create () {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    bubbles = game.add.group();
    bubbles.enableBody = true;
    bubbles.physicsBodyType = Phaser.Physics.ARCADE;
    game.physics.enable(bubbles, Phaser.Physics.ARCADE);

    button = game.add.button(game.width - 128, game.height - 72,
         'playpausebutton', pausePlay, this, 1, 1, 1, 1);
    button.scale.setTo(0.75, 0.75);

    resetButton = game.add.button(game.width - 128, 12,
         'playpausebutton', resetBubbles, this, 2, 2, 2, 2);
    resetButton.scale.setTo(0.75, 0.75);

    tonalEnv = new Tonality();
    var delay = 0;

    var allNotes = tonalEnv.getFullChordArray(1, 7, [0,0,0,-1]);
    notes = tonalEnv.trimArray(allNotes, 36, 84);

    makeBubbles();

    Tone.Transport.scheduleRepeat(function(time){
        // cycle through balls and modify sequence notes based on position
        if (isPaused == false) {
            bubbles.forEach(function(bubble){
                var pitch = notes[Math.floor(bubble.body.y/game.world.height * notes.length)];
                var pan = bubble.body.x/game.world.width;
                bubble.tonePattern.setPanPosition(pan);
                //var index = game.rnd.pick([0, 1, 2, 3]);
                //bubble.tonePattern.at(index, pitch);

                var replaceIndex = bubble.tonePattern.randomReplaceNote(pitch);
                //console.log("Pitch we are changing: " + pitch + " at index " + replaceIndex);
            }, this, true);
        }
    }, "4n");

    bassSynth = new Tone.MonoSynth();
    bassPanVol = new Tone.PanVol(0.5, -27);
    bassSynth.connect(bassPanVol);
    bassPanVol.connect(Tone.Master);

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
        chordProgPart.start(0);

        var bassArpeggio = tonalEnv.scaleOctave(tonalEnv.getChord(1, 7, []), 4);
        var bassRoot = bassArpeggio[0];

    var bassPart = new Tone.Sequence(function(time, note){
    	//console.log(note);
        bassSynth.triggerAttackRelease(Tone.Frequency(note, "midi"), "8n", time);

    }, [bassRoot], "1m");
    bassPart.loop = true;
    bassPart.loopEnd = "1m";
    bassPart.start(0);

    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = "12m";
    Tone.Transport.bpm.value = 112;
    Tone.Transport.latencyHint = 'playback';
    //Tone.Transport.start("+0.8");

}

function update() {
game.physics.arcade.collide(bubbles, bubbles, bubblesCollide, null, this);
}

function bubblesCollide(bubble1, bubble2) {
    bubble1.tonePattern.changePatternTypeRandomly();
    bubble1.tonePattern.changePatternTypeRandomly();
    //console.log("pop");
}

function makeBubbles() {
    for (var i = 0; i < 2; i++) {
        var musBubble = bubbles.create(game.world.randomX, game.world.randomY, 'bubble');
        musBubble.anchor.set(0.5, 0.5);
        musBubble.inputEnabled = true;
        musBubble.input.enableDrag(true);
        game.physics.enable(musBubble, Phaser.Physics.ARCADE);
        musBubble.scale.set(game.rnd.realInRange(0.1, 0.4));

        musBubble.body.bounce.setTo(1,1);
        //musBubble.body.velocity.setTo(100, 50);

        musBubble.checkWorldBounds = true;
        musBubble.body.collideWorldBounds = true;

        musBubble.body.velocity.x = game.rnd.between(-200, 200);
        musBubble.body.velocity.y = game.rnd.between(-200, 200);

        musBubble.body.angularVelocity = game.rnd.between(-10, 10);

        var index = Math.floor(musBubble.body.y/game.world.height * notes.length);
        var startNotes = [];
        for (var k = 0; k < 4; k++) {
            //var noteName = Tone.Frequency(notes[index+k], "midi").toNote();
            var noteName = notes[index+k];
            startNotes.push(noteName);
        }

        var subDiv = game.rnd.pick([2, 3, 4, 12]) + "n";

        musBubble.tonePattern = new PatternPlayer();
        musBubble.tonePattern.setNotes(startNotes);
        musBubble.tonePattern.setLoopInterval(subDiv);

    }
}

function pausePlay() {
    if (isPaused == false) {
        Tone.Transport.pause();
        button.setFrames(1, 1, 1, 1);
        isPaused = true;
    } else {
        Tone.Transport.start("+0.1");
        button.setFrames(0, 0, 0, 0);
        isPaused = false;
    }
}

function resetBubbles() {
    console.log("Reset");
    Tone.Transport.stop();
    isPaused = true;
    bubbles.forEach(function(bubble){
        bubble.tonePattern.instrument.dispose();
        bubble.tonePattern.panVol.dispose();
        bubble.tonePattern.pattern.dispose();
    }, this, true);
    bubbles.removeAll(true, false, false);
    button.setFrames(1,1,1,1);
    makeBubbles();
}
