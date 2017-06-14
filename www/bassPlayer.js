
bassPlayer = function(game) {
    this.bubbles;  // main group of bubble sprites
    this.bubbleScale = 0.25;
    this.xDown;
    this.yDown;
    //this.tonalEnv = new Tonality();
    this.lowestOctave = 4;
    this.pitchRange = 2; // number of octaves
    this.pitches = []; // main array for pitch data on y axis
    this.timeSubDiv = 8; // resolution of time on x axis
    var options = {
        "instrument": "pitchedSampler"
    };

    var allPitches = game.tonalEnv.getFullChordArray(1, 7, []);
    var lowestPitch = game.tonalEnv.key + (this.lowestOctave * 12);
    this.pitches = game.tonalEnv.trimArray(allPitches, lowestPitch, lowestPitch + (this.pitchRange * 12));

    options.sequence = [this.pitches[0], null, this.pitches[1], null,
                        this.pitches[2], null, this.pitches[3], null];

    this.player = new SequencePlayer(options);
    this.player.loop = true; // FIXME redundant?

    chordProgPart = new Tone.Part((function(time, value) {

        //console.log("bar num " + Tone.Transport.position);
        //console.log("chordProg ping at " + Tone.Transport.position);
        var allNotes = game.tonalEnv.getFullChordArray(value.root, value.tochordtone, value.alterations);
        var lowestPitch = allNotes[0] + (this.lowestOctave * 12);
        var prevPitches = this.pitches;
        this.pitches = game.tonalEnv.trimArray(allNotes, lowestPitch, lowestPitch + (this.pitchRange * 12));
        //console.log("chord change " + this.pitches);
        var self = this;
        // transpose bubble pitch values accordingly
        for (i = 0; i < this.pitches.length; i++) {
            var sequenceEvent = this.player.sequence.at(i);
            if (sequenceEvent != null) {

                var newPitch = this.pitches[prevPitches.indexOf(sequenceEvent.value)];
                this.player.sequence.at(i, newPitch);
            }

        }
        // this.bubbles.forEach(function(bubble) {
        //     self.setToneEventFromBubble(bubble);
        // })

    }).bind(this), game.chordProgression.prog);

    chordProgPart.loop = true;
    chordProgPart.loopEnd = game.chordProgression.prog.length + "m";
    chordProgPart.start(0);

};

bassPlayer.prototype = {
    preload: function() {
        //console.log("Pre-loading");
        game.load.image('bubble', 'assets/bubble256.png');
        game.load.spritesheet('playpausebutton', 'assets/pause_play_reset.png', 148, 80);
    },

    create: function() {
        //console.log("Create bass player");
        game.stage.backgroundColor = "#303f9f";
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.bubbles = game.add.group();
        this.bubbles.enableBody = true;
        this.bubbles.physicsBodyType = Phaser.Physics.ARCADE;
        game.physics.enable(this.bubbles, Phaser.Physics.ARCADE);

        for (var i=0; i < this.timeSubDiv; i++) {
            var sequenceEvent = this.player.sequence.at(i);
            if (sequenceEvent != null) {
                var bubbleX = Math.floor(i/this.timeSubDiv * game.width) + 1;
                // sequenceEvent.value is a midi note; need to find index
                var index = this.pitches.indexOf(sequenceEvent.value);
                var bubbleY = Math.floor((this.pitches.length - index)/this.pitches.length * game.height);
                var musBubble = this.bubbles.create(bubbleX, bubbleY, 'bubble');
                musBubble.anchor.set(0.5, 0.5);
                musBubble.inputEnabled = true;
                musBubble.input.enableDrag(true);
                musBubble.events.onDragStart.add(this.onDragStart, this);
                musBubble.events.onDragStop.add(this.onDragStop, this);
                game.physics.enable(musBubble, Phaser.Physics.ARCADE);
                musBubble.scale.set(this.bubbleScale);

            }
        }


        this.bubbles.forEach(function(bubble) {
            // set bassPart events based on bubble position
            this.setToneEventFromBubble(bubble);

        }, this, true);

    },

    update: function() {

    },

    onDragStart: function(sprite, pointer) {
        this.xDown = pointer.x;
        this.yDown = pointer.y;
        // remove current part at this time pointer
        var time = Math.floor(sprite.x/game.world.width * this.timeSubDiv);
        //var time = "0m + (" + time + " * " + this.timeSubDiv + "n)";
        //this.player.sequence.remove(time);
        this.player.sequence.at(time, null);
        //console.log("touch down at " + this.xDown + ", " + this.yDown);
    },

    onDragStop: function(sprite, pointer) {
        this.setToneEventFromBubble(sprite);

    },

    setToneEventFromBubble: function(bubble) {
        //var indexHigh = this.pitches.length;
        //console.log("indexHigh is " + indexHigh);
        var pitchIndex = (Math.floor((game.world.height - bubble.y)/game.world.height * this.pitches.length));
        var time = Math.floor(bubble.x/game.world.width * this.timeSubDiv);
        //var time = "0m + (" + time + " * " + this.timeSubDiv + "n)";
        this.player.sequence.at(time, this.pitches[pitchIndex]);
        //console.log("Bubble time " + time + " pitchIndex " + pitchIndex + " and pitch " + this.pitches[pitchIndex]);
        //console.log("Looping through bubbles; time: " + time);
    }

}
