
var startEvent = "DOMContentLoaded";
if(window.cordova){
    startEvent = "deviceready";
}
document.addEventListener(startEvent,function() {


});

var deviceWidth = window.innerWidth;// * window.devicePixelRatio;
var deviceHeight = window.innerHeight;// * window.devicePixelRatio;
var bubbles;

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


    var delay = 0;

    for (var i = 0; i < 8; i++) {
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

        musBubble.body.velocity.x = game.rnd.between(-100, 100);
        musBubble.body.velocity.y = game.rnd.between(-100, 100);

        musBubble.body.angularVelocity = game.rnd.between(-10, 10);

    }
    // for (var i = 0; i < 40; i++)
    // {
    //     var sprite = game.add.sprite(-100 + (game.world.randomX), 600, 'bubble');
    //
    //     sprite.scale.set(game.rnd.realInRange(0.1, 0.6));
    //
    //     var speed = game.rnd.between(4000, 6000);
    //
    //     game.add.tween(sprite).to({ y: -256 }, speed, Phaser.Easing.Sinusoidal.InOut, true, delay, 1000, false);
    //
    //     delay += 200;
    // }
}

function update() {
game.physics.arcade.collide(bubbles, bubbles, bubblesCollide, null, this);
}

function bubblesCollide() {
    console.log("pop");
}
