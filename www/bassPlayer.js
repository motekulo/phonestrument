
bassPlayer = function(game) {
    this.bubbles;  // main group of bubble sprites
    this.bubbleScale = 0.35;
    this.xDown;
    this.yDown;
    this.tonalEnv = new Tonality();
};

bassPlayer.prototype = {
    preload: function() {
        console.log("Pre-loading");
        game.load.image('bubble', 'assets/bubble256.png');
        game.load.spritesheet('playpausebutton', 'assets/pause_play_reset.png', 148, 80);
    },

    create: function() {
        console.log("Create");
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.bubbles = game.add.group();
        this.bubbles.enableBody = true;
        this.bubbles.physicsBodyType = Phaser.Physics.ARCADE;
        game.physics.enable(this.bubbles, Phaser.Physics.ARCADE);

        for (var i = 0; i < 2; i++) {
            var musBubble = this.bubbles.create(game.world.randomX, game.world.randomY, 'bubble');
            musBubble.anchor.set(0.5, 0.5);
            musBubble.inputEnabled = true;
            musBubble.input.enableDrag(true);
            musBubble.events.onDragStart.add(this.onDragStart, this);
            musBubble.events.onDragStop.add(this.onDragStop, this);
            game.physics.enable(musBubble, Phaser.Physics.ARCADE);

            musBubble.scale.set(this.bubbleScale);
        }



        var bassArpeggio = this.tonalEnv.scaleOctave(this.tonalEnv.getChord(1, 7, []), 4);
        var bassRoot = bassArpeggio[0];
        bassPart = new Tone.Sequence(function(time, note){
        	//console.log(note);
            //bassSynth.triggerAttackRelease(Tone.Frequency(note, "midi"), "8n", time);

        }, [bassRoot], "1m");
        bassPart.loop = true;
        bassPart.loopEnd = "1m";

        

    },

    update: function() {

    },

    onDragStart: function(sprite, pointer) {
        this.xDown = pointer.x;
        this.yDown = pointer.y;
        //console.log("touch down at " + this.xDown + ", " + this.yDown);
    },

    onDragStop: function(sprite, pointer) {
        //console.log("touch up at " + pointer.x + ", " + pointer.y);
    }

}
