
var startEvent = "DOMContentLoaded";
if(window.cordova){
    startEvent = "deviceready";
}
document.addEventListener(startEvent,function() {

    //var plucky = new Tone.PluckSynth().toMaster();
    var plucky = new Tone.PolySynth(24, Tone.MembraneSynth).toMaster();
    var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '',
                                { preload: preload, create: create, update: update });

    function preload () {
        //game.load.image('logo', 'phaser.png');
        game.load.image('sky', 'assets/underwater3.png');
      	game.load.spritesheet('rain', 'assets/rain.png', 17, 17);
        game.load.spritesheet('balls', 'assets/balls.png', 17, 17);


        plucky.triggerAttack("C4");
    }

    function create () {
      //  var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
      //  logo.anchor.setTo(0.5, 0.5);

      //game.add.image(0, 0, 'sky');

    	// var emitter = game.add.emitter(game.world.centerX, 0, 12);
      //
    	// emitter.width = game.world.width;
      // //emitter.width = game.world.width;
    	// // emitter.angle = 30; // uncomment to set an angle for the rain.
      //
    	// emitter.makeParticles('rain');
      //
    	// emitter.minParticleScale = 0.1;
    	// emitter.maxParticleScale = 0.5;
      //
    	// emitter.setYSpeed(300, 500);
    	// emitter.setXSpeed(-5, 5);
      //
    	// emitter.minRotation = 0;
    	// emitter.maxRotation = 0;
      //
    	// emitter.start(false, 1600, 5, 0);

        game.physics.startSystem(Phaser.Physics.ARCADE);

         leftEmitter = game.add.emitter(50, game.world.centerY - 200);
         leftEmitter.bounce.setTo(0.5, 0.5);
         leftEmitter.setXSpeed(100, 200);
         leftEmitter.setYSpeed(-50, 50);
         leftEmitter.makeParticles('balls', 0, 24, true, true);

         rightEmitter = game.add.emitter(game.world.width - 50, game.world.centerY - 200);
         rightEmitter.bounce.setTo(0.5, 0.5);
         rightEmitter.setXSpeed(-100, -200);
         rightEmitter.setYSpeed(-50, 50);
         rightEmitter.makeParticles('balls', 1, 24, true, true);

         // explode, lifespan, frequency, quantity
         leftEmitter.start(false, 6000, 40);
         rightEmitter.start(false, 6000, 40);

    }
    function update() {

        game.physics.arcade.collide(leftEmitter, rightEmitter, change, null, this);

    }

    function change(a, b) {

        a.frame = 3;
        b.frame = 3;
        plucky.triggerAttack(a.position.y);


    }
});
