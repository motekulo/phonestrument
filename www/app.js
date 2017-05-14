
var startEvent = "DOMContentLoaded";
if(window.cordova){
    startEvent = "deviceready";
}
document.addEventListener(startEvent,function() {


});


var game = new Phaser.Game(deviceWidth, deviceHeight * 0.85, Phaser.AUTO, 'stage', {
    preload: preload, create: create, update: update });

var tonalEnv = new Tonality();


function preload () {

}

function create () {

}

function update() {

}
