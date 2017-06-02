
// var startEvent = "DOMContentLoaded";
// if(window.cordova){
//     startEvent = "deviceready";
// }
// document.addEventListener(startEvent,function() {
//
// });

var deviceWidth = window.innerWidth;// * window.devicePixelRatio;
var deviceHeight = window.innerHeight;// * window.devicePixelRatio;
//var bubbles;
var isPaused = true;
var button;
var resetButton;
var tally = {
    "solo" : 0,
    "sampler" : 0,
    "pitchedSampler" : 0
}

var bassPart;

var tonalEnv;
var notes = [];

var xDown;
var yDown;

var result = [];  // for debugging
//var chordProgPart;
var players = [];
var urls = ["./assets/samples/kick_mix_1.wav",
            "./assets/samples/snare_mix_1.wav",
            "./assets/samples/ohh_mixed_1.wav",              "./assets/samples/chh_mixed_1.wav"];

tonalEnv = new Tonality();
var delay = 0;

var allNotes = tonalEnv.getFullChordArray(1, 7, [0,0,0,-1]);
notes = tonalEnv.trimArray(allNotes, 36, 84);

//makePlayers();

var numProggies = tonalEnv.chordProgressions.length;
var progIndex = Math.floor(Math.random() * numProggies);
var chordProg = tonalEnv.chordProgressions[progIndex].prog;
chordProgPart = new Tone.Part(function(time, value) {
    //console.log("chord change " + value);
    //console.log("bar num " + Tone.Transport.position);
    var allNotes = tonalEnv.getFullChordArray(value.root, value.tochordtone, value.alterations);
    notes = tonalEnv.trimArray(allNotes, 36, 84);

}, chordProg);

chordProgPart.loop = true;
chordProgPart.loopEnd = chordProg.length + "m";
chordProgPart.start(0);

Tone.Transport.loop = true;
Tone.Transport.loopStart = 0;
Tone.Transport.loopEnd = chordProgPart.loopEnd;
Tone.Transport.bpm.value = 112;
//Tone.Transport.latencyHint = 'playback';
//Tone.context.latencyHint = 'playback';
Tone.context.latencyHint = 1.6;

function makePlayer(options) {
    var index = Math.floor(Math.random() * notes.length);
    var startNotes = [];
    for (var k = 0; k < 4; k++) {
        //var noteName = Tone.Frequency(notes[index+k], "midi").toNote();
        var noteName = notes[index+k];
        startNotes.push(noteName);
    }
    var subDiv = "4n";

    var tonePattern = new PatternPlayer(options);
    tonePattern.setNotes(startNotes);
    tonePattern.setLoopInterval(subDiv);
    players.push(tonePattern);

}


function pausePlay() {
    if (isPaused == false) {
        Tone.Transport.pause();
        //button.setFrames(1, 1, 1, 1);
        isPaused = true;
    } else {
        Tone.Transport.start("+0.1");
        //button.setFrames(0, 0, 0, 0);
        isPaused = false;
    }
}

function resetPlayers() {
    console.log("Reset");
    Tone.Transport.stop();
    isPaused = true;
    for (var i = 0; i < players.length; i++){
        players[i].instrument.dispose();
        players[i].panVol.dispose();
        players[i].pattern.dispose();
    }

    resetChordProgression();

}

function resetChordProgression() {
    // And change chord progression
    var numProggies = tonalEnv.chordProgressions.length;
    var progIndex = Math.floor(Math.random() * numProggies);
    var chordProg = tonalEnv.chordProgressions[progIndex].prog;
    chordProgPart.removeAll();
    for (var i = 0; i < chordProg.length; i++) {
        chordProgPart.at(chordProg[i].time, chordProg[i]);
    }
    chordProgPart.loopEnd = chordProg.length + "m";
    Tone.Transport.loopEnd = chordProgPart.loopEnd;

    Tone.Transport.position = 0;
    console.log("Prog changed to " + tonalEnv.chordProgressions[progIndex].name);
}

nx.onload = function(){

    toggle1.on('*', function(data) {
        console.log("Toggle data " + data.value);
        pausePlay();
    })

    button1.on('*', function(data) {

        if (data.press == 0) {
            resetChordProgression();
        }

    })

    addSolo.on('*', function(data) {
        if (data.press == 0) {
            var options = {
                "instrument" : "solo"
            }
            makePlayer(options);
            tally.solo++;
            console.log("solo " + tally.solo);
        }

    })

    addSampler.on('*', function(data) {
        if (data.press == 0) {
            var options = {
                "instrument" : "sampler",
                "url" : urls[tally.sampler % 4]
            }
            makePlayer(options);
            tally.sampler++;
            console.log("sampler " + tally.sampler);
        }


    })

    addPitchedSampler.on('*', function(data) {
        if (data.press == 0) {
            var options = {
                "instrument" : "pitchedSampler"
            }
            makePlayer(options);
            tally.pitchedSampler++;
            console.log("pitched sampler " + tally.pitchedSampler);
        }

    })

}
