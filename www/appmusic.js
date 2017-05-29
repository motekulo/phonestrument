
// var startEvent = "DOMContentLoaded";
// if(window.cordova){
//     startEvent = "deviceready";
// }
// document.addEventListener(startEvent,function() {
//
// });

var deviceWidth = window.innerWidth;// * window.devicePixelRatio;
var deviceHeight = window.innerHeight;// * window.devicePixelRatio;
var bubbles;
var isPaused = true;
var button;
var resetButton;

var bassPart;

var tonalEnv;
var notes = [];

var xDown;
var yDown;

var result = [];  // for debugging
//var chordProgPart;
var players = [];


tonalEnv = new Tonality();
var delay = 0;

var allNotes = tonalEnv.getFullChordArray(1, 7, [0,0,0,-1]);
notes = tonalEnv.trimArray(allNotes, 36, 84);

makePlayers();

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
Tone.Transport.latencyHint = 'playback';

function makePlayers() {
    for (var i = 0; i < 4; i++) {

        var index = Math.floor(Math.random() * notes.length);
        var startNotes = [];
        for (var k = 0; k < 4; k++) {
            //var noteName = Tone.Frequency(notes[index+k], "midi").toNote();
            var noteName = notes[index+k];
            startNotes.push(noteName);
        }
        var subDiv = "4n";

        var tonePattern = new PatternPlayer();
        tonePattern.setNotes(startNotes);
        tonePattern.setLoopInterval(subDiv);
        players.push(tonePattern);

    }
    // experiment with changing to sampler (unpitched)
    //var urls = ["./assets/ohh_mixed_1.wav", "./assets/chh_mixed_1.wav"];
    //players[2].setSamplerInstrument(urls[0]);
    //players[3].setSamplerInstrument(urls[1]);
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

function resetBubbles() {
    console.log("Reset");
    Tone.Transport.stop();
    isPaused = true;
    for (var i = 0; i < players.length; i++){
        players[i].instrument.dispose();
        players[i].panVol.dispose();
        players[i].pattern.dispose();
    }
    //bubbles.removeAll(true, false, false);
    //button.setFrames(1,1,1,1);
    makePlayers();
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

        if (data.press == 1) {
            resetChordProgression();
        }

    })
    button2.on('*', function(data) {


    })

    slider1.on('*', function(data) {

        //console.log(data);
        var filterFreq = (data.value * 150);
        console.log("filterFreq: " + filterFreq);
        //plucky.filter.frequency.value = filterFreq;
        players[0].instrument.set({
            "filterEnvelope" : {
                "baseFrequency" : filterFreq
            }
        });
    })
    slider2.on('*', function(data) {
        players[0].panVol.volume.value = -(1-data.value) * 48;

    })
    slider5.on('*', function(data) {
        var attack = data.value * 0.4;
        players[0].instrument.set({
            "envelope" : {
                "attack" : attack
            }
        });


    })


    slider3.on('*', function(data) {

        console.log(data);
        var filterFreq = (data.value * 150);
        console.log("filterFreq: " + filterFreq);
        //plucky.filter.frequency.value = filterFreq;
        players[1].instrument.set({
            "filterEnvelope" : {
                "baseFrequency" : filterFreq
            }
        });
    })
    slider4.on('*', function(data) {
        players[1].panVol.volume.value = -(1-data.value) * 48;
    })

    slider6.on('*', function(data) {
        var attack = data.value * 0.4;
        players[1].instrument.set({
            "envelope" : {
                "attack" : attack
            }
        });


    })
}
