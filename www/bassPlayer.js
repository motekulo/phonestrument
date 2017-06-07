
bassPlayer = function(game) {
    this.bubbles;  // main group of bubble sprites
    this.bubbleScale = 0.35;
    this.xDown;
    this.yDown;
    this.tonalEnv = new Tonality();
    this.lowestOctave = 3;
    this.pitchRange = 2; // number of octaves
    this.pitches = []; // main array for pitch data on y axis
    this.timeSubDiv = 8; // resolution of time on x axis
    var options = {
        "instrument": "pitchedSampler"
    };
    this.player = new PartPlayer(options);
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

        var allPitches = this.tonalEnv.getFullChordArray(1, 7, []);
        var lowestPitch = this.tonalEnv.key + (this.lowestOctave * 12);
        this.pitches = this.tonalEnv.trimArray(allPitches, lowestPitch, lowestPitch + (this.pitchRange * 12));

        var bassArpeggio = this.tonalEnv.scaleOctave(this.tonalEnv.getChord(1, 7, []), 4);
        var bassRoot = bassArpeggio[0];

        this.player.setNotes(bassArpeggio);
        this.player.setLoopInterval(4);  // FIXME just for now

        for (var i = 0; i < 4; i++) {
            // place first bubble root, beginning of loop; res randomly
            if (i == 0) {
                var musBubble = this.bubbles.create(0, game.height, 'bubble');
            } else {
                var musBubble = this.bubbles.create(game.world.randomX, game.world.randomY, 'bubble');
            }

            musBubble.anchor.set(0.5, 0.5);
            musBubble.inputEnabled = true;
            musBubble.input.enableDrag(true);
            musBubble.events.onDragStart.add(this.onDragStart, this);
            musBubble.events.onDragStop.add(this.onDragStop, this);
            game.physics.enable(musBubble, Phaser.Physics.ARCADE);

            musBubble.scale.set(this.bubbleScale);
        }

        this.bubbles.forEach(function(bubble) {
            // set bassPart events based on bubble position
            var indexHigh = this.pitches.length - 1;
            var pitchIndex = indexHigh - Math.floor(bubble.body.y/game.world.height * indexHigh);
            var time = Math.floor(bubble.body.x/game.world.width * this.timeSubDiv);
            var time = "0m + (" + time + " * " + this.timeSubDiv + "n)";
            this.player.part.at(time, this.pitches[pitchIndex]);
            //console.log("Looping through bubbles; time: " + time);

        }, this, true);

    },

    update: function() {

    },

    onDragStart: function(sprite, pointer) {
        this.xDown = pointer.x;
        this.yDown = pointer.y;
        // remove current part at this time pointer
        var time = Math.floor(sprite.body.x/game.world.width * this.timeSubDiv);
        var time = "0m + (" + time + " * " + this.timeSubDiv + "n)";
        this.player.part.remove(time);
        //console.log("touch down at " + this.xDown + ", " + this.yDown);
    },

    onDragStop: function(sprite, pointer) {
        var indexHigh = this.pitches.length - 1;
        var pitchIndex = indexHigh - Math.floor(sprite.body.y/game.world.height * indexHigh);
        var time = Math.floor(sprite.body.x/game.world.width * this.timeSubDiv);
        var time = "0m + (" + time + " * " + this.timeSubDiv + "n)";
        this.player.part.at(time, this.pitches[pitchIndex]);
        //console.log("touch up at " + pointer.x + ", " + pointer.y);


    }

}
