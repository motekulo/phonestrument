
var startEvent = "DOMContentLoaded";

var deviceWidth = window.innerWidth;// * window.devicePixelRatio;
var deviceHeight = window.innerHeight;// * window.devicePixelRatio;
var isPaused = true;
var chordProgPart;
//var tonalEnv;

if(window.cordova){
    startEvent = "deviceready";
}
document.addEventListener(startEvent,function() {
    game = new Phaser.Game("94", "100", Phaser.AUTO, "stage");
    game.tonalEnv = new Tonality();
    game.chordProgression = {name: "1_4_1_5",
     prog: [{time: "0m", root: 1, tochordtone: 5, alterations: [0,0,0]},
            {time: "1m", root: 4, tochordtone: 7, alterations: [0,0,0,0]},
            {time: "2m", root: 1, tochordtone: 7, alterations: [0,0,0,0]},
            {time: "3m", root: 5, tochordtone: 7, alterations: [0,0,0,0]}]
        };
    game.state.add("BassPlayer", bassPlayer);
    game.state.add("DrumPlayer", drumPlayer);
    //game.state.start("BassPlayer");
    game.state.start("DrumPlayer");

    //tonalEnv = new Tonality();

    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = "4m";
    Tone.Transport.bpm.value = 112;
    Tone.Transport.latencyHint = "playback";
});

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

nx.onload = function() {
    nx.colorize("#7986cb");
    toggle1.on('*', function(data) {
        //console.log("Toggle data " + data.value);
        pausePlay();
    });
    button1.on('*', function(data) {
        if (data.press == 1) {
            game.state.start("BassPlayer");
        }

    });
    button2.on('*', function(data) {
        if (data.press == 1) {
            game.state.start("DrumPlayer");
        }
    });
}
