
var startEvent = "DOMContentLoaded";
if(window.cordova){
    startEvent = "deviceready";
}
document.addEventListener(startEvent,function() {


});

var deviceWidth = window.innerWidth;// * window.devicePixelRatio;
var deviceHeight = window.innerHeight;// * window.devicePixelRatio;
var bubbles;

var tonalEnv;
var notes = [];
//var chordProgPart;

var game = new Phaser.Game(deviceWidth, deviceHeight * 0.85, Phaser.AUTO, 'stage', {preload: preload, create: create, update: update });

//var tonalEnv = new Tonality();


function preload () {
    game.load.image('bubble', 'assets/bubble256.png');
}

function create () {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    bubbles = game.add.group();
    bubbles.enableBody = true;
    bubbles.physicsBodyType = Phaser.Physics.ARCADE;
    game.physics.enable(bubbles, Phaser.Physics.ARCADE);

    tonalEnv = new Tonality();

    var delay = 0;



    var allNotes = tonalEnv.getFullChordArray(1, 7, [0,0,0,-1]);
    notes = tonalEnv.trimArray(allNotes, 36, 84);

    for (var i = 0; i < 6; i++) {
        musBubble = bubbles.create(game.world.randomX, game.world.randomY, 'bubble');
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

        var subDiv = game.rnd.pick([1, 2, 3, 4, 12]) + "n";

        musBubble.tonePattern = new PatternPlayer();
        musBubble.tonePattern.setNotes(startNotes);
        musBubble.tonePattern.setLoopInterval(subDiv);

    }

    Tone.Transport.scheduleRepeat(function(time){
           // cycle through balls and modify sequence notes based on position
           bubbles.forEach(function(bubble){
               var pitch = notes[Math.floor(bubble.body.y/game.world.height * notes.length)];
               //var index = game.rnd.pick([0, 1, 2, 3]);
               //bubble.tonePattern.at(index, pitch);
               bubble.tonePattern.randomReplaceNote(pitch);
           }, this, true);
    }, "4n");

    bassSynth = new Tone.MonoSynth();
    bassPanVol = new Tone.PanVol(0.5, -24);
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

        bassArpeggio = tonalEnv.scaleOctave(tonalEnv.getChord(1, 7, []), 4);

    var bassPart = new Tone.Sequence(function(time, note){
    	//console.log(note);
        bassSynth.triggerAttackRelease(Tone.Frequency(note, "midi"), "8n", time);

    }, bassArpeggio, "4n");
    bassPart.loop = true;
    bassPart.loopEnd = "1m";
    bassPart.start(0);

    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = "12m";
    Tone.Transport.bpm.value = 112;
    Tone.Transport.latencyHint = 'playback';
    Tone.Transport.start("+0.8");

}

function update() {
game.physics.arcade.collide(bubbles, bubbles, bubblesCollide, null, this);
}

function bubblesCollide() {
    console.log("pop");
}
