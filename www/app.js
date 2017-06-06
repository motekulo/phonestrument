
var startEvent = "DOMContentLoaded";

var deviceWidth = window.innerWidth;// * window.devicePixelRatio;
var deviceHeight = window.innerHeight;// * window.devicePixelRatio;

if(window.cordova){
    startEvent = "deviceready";
}
document.addEventListener(startEvent,function() {
    game = new Phaser.Game(deviceWidth, deviceHeight, Phaser.AUTO, "");
    game.state.add("BassPlayer", bassPlayer);
    game.state.start("BassPlayer");
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = "1m";
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
}
