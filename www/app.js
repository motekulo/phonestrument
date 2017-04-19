
var startEvent = "DOMContentLoaded";
if(window.cordova){
    startEvent = "deviceready";
}
document.addEventListener(startEvent,function() {

    //var plucky = new Tone.PluckSynth().toMaster();
    var plucky = new Tone.PolySynth(24, Tone.MembraneSynth).toMaster();
    var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update
    });

    var leftEmitter;
    var rightEmitter;
    var ship;
    var cursors;

    Tone.Transport.loop = false;
    Tone.Transport.bpm.value = 116;
    Tone.Transport.scheduleRepeat(function(time){
        console.log("Ping...");
        for (var i = 0; i < leftEmitter.children.length; i++){
            var kidX = leftEmitter.children[i].x;
            console.log("Child " + i + " x: " + kidX);
        }
        leftEmitter.y = leftEmitter.y - 5;

    }, "1m");

    function preload () {
        //game.load.image('logo', 'phaser.png');
        game.load.image('sky', 'assets/underwater3.png');
        game.load.spritesheet('rain', 'assets/rain.png', 17, 17);
        game.load.spritesheet('balls', 'assets/balls.png', 17, 17);

        game.load.image('ship', 'assets/ship.png');


        //plucky.triggerAttack("C4");   // Test sound from Tone.js
    }

    function create () {


        game.physics.startSystem(Phaser.Physics.ARCADE);

        leftEmitter = game.add.emitter(50, game.world.centerY - 200);
        leftEmitter.gravity = 0;
        leftEmitter.bounce.setTo(1, 1);
        leftEmitter.setXSpeed(100, 200);
        leftEmitter.setYSpeed(-50, 50);
        leftEmitter.makeParticles('balls', 0, 24, true, true);

        rightEmitter = game.add.emitter(game.world.width - 50, game.world.centerY - 200);
        rightEmitter.gravity = 0;
        rightEmitter.bounce.setTo(1, 1);
        rightEmitter.setXSpeed(-100, -200);
        rightEmitter.setYSpeed(-50, 50);
        rightEmitter.makeParticles('balls', 1, 24, true, true);

        // explode, lifespan, frequency, quantity
        leftEmitter.start(false, 12000, 40);
        rightEmitter.start(false, 12000, 40);

        ship = game.add.sprite(400, 400, 'ship');
        game.physics.enable(ship, Phaser.Physics.ARCADE);
        ship.body.collideWorldBounds = true;
        ship.body.bounce.set(1);

        cursors = game.input.keyboard.createCursorKeys();

        Tone.Transport.start();

    }
    function update() {

        game.physics.arcade.collide(leftEmitter, rightEmitter, change, null, this);

        game.physics.arcade.collide(ship, leftEmitter, shipHitLeft, null, this);
        game.physics.arcade.collide(ship, rightEmitter, shipHitRight, null, this);

        if (cursors.left.isDown) {
            ship.body.velocity.x -= 4;
        } else if (cursors.right.isDown) {
            ship.body.velocity.x += 4;
        } else if (cursors.up.isDown) {
            ship.body.velocity.y -= 4;
        } else if (cursors.down.isDown) {
            ship.body.velocity.y += 4;
        }

    }

    function change(a, b) {

        a.frame = 3;
        b.frame = 3;
        plucky.triggerAttack(a.position.y);


    }

    function shipHitLeft(sprite, leftParticle) {
        console.log("Sprite " + sprite + " hit " + leftParticle);
    }

    function shipHitRight(sprite, rightParticle) {
        console.log("Sprite " + sprite + " hit " + rightParticle);
    }
});
