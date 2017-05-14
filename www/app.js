
var startEvent = "DOMContentLoaded";
if(window.cordova){
    startEvent = "deviceready";
}
document.addEventListener(startEvent,function() {


});
var deviceWidth = window.innerWidth;// * window.devicePixelRatio;
var deviceHeight = window.innerHeight;// * window.devicePixelRatio;

var game = new Phaser.Game(deviceWidth, deviceHeight * 0.85, Phaser.AUTO, 'stage', {
    preload: preload, create: create, update: update });

    var tonalEnv = new Tonality();


    function preload () {
        game.load.image('bubble', 'assets/bubble256.png');
    }

    function create () {
        var delay = 0;

        for (var i = 0; i < 40; i++)
        {
            var sprite = game.add.sprite(-100 + (game.world.randomX), 600, 'bubble');

            sprite.scale.set(game.rnd.realInRange(0.1, 0.6));

            var speed = game.rnd.between(4000, 6000);

            game.add.tween(sprite).to({ y: -256 }, speed, Phaser.Easing.Sinusoidal.InOut, true, delay, 1000, false);

            delay += 200;
        }
    }

    function update() {

    }
