
var startEvent = "DOMContentLoaded";

var deviceWidth = window.innerWidth;// * window.devicePixelRatio;
var deviceHeight = window.innerHeight;// * window.devicePixelRatio;
var isPaused = true;
var chordProgPart;
var tonalEnv;

if(window.cordova){
    startEvent = "deviceready";
}
document.addEventListener(startEvent,function() {
    game = new Phaser.Game(deviceWidth * 0.9, deviceHeight * 0.8, Phaser.AUTO, "");
    game.state.add("BassPlayer", bassPlayer);
    game.state.add("DrumPlayer", drumPlayer);
    //game.state.start("BassPlayer");
    game.state.start("DrumPlayer");

    //tonalEnv = new Tonality();

    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = "4m";
    Tone.Transport.bpm.value = 112;
    Tone.Transport.latencyHint = 'playback';
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


nx.onload = function(){

    toggle1.on('*', function(data) {
        console.log("Toggle data " + data.value);
        pausePlay();
    })
    button1.on('*', function(data) {
        console.log("Button data " + data.value);
        game.state.start("BassPlayer");
    })
    button2.on('*', function(data) {
        console.log("Button data " + data.value);
        game.state.start("DrumPlayer");
    })
}
