
drumPlayer = function(game) {
    this.bubbles;  // main group of bubble sprites
    this.tally = 0;
    this.bubbleScale = 0.25;
    this.xDown;
    this.yDown;
    this.players=[];
    this.numPlayers = 4;

    this.timeSubDiv = 8; // resolution of time on x axis
    var options = {
        "instrument": "sampler",
        "url": "./assets/samples/ohh_mixed_1.wav"
    };

    var kickPart = ["G4", null, "G4", null, "G4", null, "G4", null];
    var snarePart = [null, null, "G4", null, null, null, "G4", null];
    var ohhPart = ["G4", "G4", null, "G4", "G4", "G4", null, null];
    var chhPart = [null, null, "G4", null, null, null, "G4", null];

    options.sequence = ohhPart;
    this.openHatPlayer = new SequencePlayer(options);
    this.players.push(this.openHatPlayer);

    options.url = "./assets/samples/chh_mixed_1.wav";
    options.sequence = chhPart;
    this.closedHatPlayer = new SequencePlayer(options);
    this.players.push(this.closedHatPlayer);

    options.url = "./assets/samples/snare_mix_1.wav";
    options.sequence = snarePart;
    this.snarePlayer = new SequencePlayer(options);
    this.players.push(this.snarePlayer);

    options.url = "./assets/samples/kick_mix_1.wav";
    options.sequence = kickPart;
    this.kickPlayer = new SequencePlayer(options);
    this.players.push(this.kickPlayer);
};

drumPlayer.prototype = {
    preload: function() {
        //console.log("Pre-loading");
        game.load.image('bubble', 'assets/bubble256.png');
        game.load.spritesheet('playpausebutton', 'assets/pause_play_reset.png', 148, 80);
    },

    create: function() {
        //this.tally++;
        //console.log("Create drumPlayer tally: " + this.tally);
        game.stage.backgroundColor = "#303f9f";
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.bubbles = game.add.group();
        this.bubbles.enableBody = true;
        this.bubbles.physicsBodyType = Phaser.Physics.ARCADE;
        game.physics.enable(this.bubbles, Phaser.Physics.ARCADE);

        // loop through the players, extrating parts at subdiv and adding
        // bubbles if something found
        for (var i = 0; i < this.players.length; i++) {
            for (var j = 0; j < this.timeSubDiv; j++) {
                var sequenceEvent = this.players[i].sequence.at(j);
                if (sequenceEvent != null) {  
                    var bubbleX = Math.floor(j/this.timeSubDiv * game.width);
                    var bubbleY = Math.floor(i/this.players.length * game.height);
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
        }

        // for (var i = 0; i < 4; i++) {
        //     // place first bubble root, beginning of loop; res randomly
        //     if (i == 0) {
        //         var musBubble = this.bubbles.create(24, game.height-24, 'bubble');
        //     } else {
        //         var musBubble = this.bubbles.create(game.world.randomX, game.world.randomY, 'bubble');
        //     }
        //
        //     musBubble.anchor.set(0.5, 0.5);
        //     musBubble.inputEnabled = true;
        //     musBubble.input.enableDrag(true);
        //     musBubble.events.onDragStart.add(this.onDragStart, this);
        //     musBubble.events.onDragStop.add(this.onDragStop, this);
        //     game.physics.enable(musBubble, Phaser.Physics.ARCADE);
        //
        //     musBubble.scale.set(this.bubbleScale);
        // }
        //
        // this.bubbles.forEach(function(bubble) {
        //     // set bassPart events based on bubble position
        //     this.setToneEventFromBubble(bubble);
        //
        // }, this, true);

    },

    update: function() {

    },

    onDragStart: function(bubble, pointer) {
        this.xDown = pointer.x;
        this.yDown = pointer.y;
        // remove current part at this time pointer
        var samplerIndex = (this.numPlayers - Math.floor(bubble.body.y/game.world.height * this.numPlayers))-1;
        var time = Math.floor(bubble.body.x/game.world.width * this.timeSubDiv);
        if (samplerIndex < 0) samplerIndex = 0;
        if (samplerIndex > this.numPlayers - 1) samplerIndex = this.numPlayers - 1;
        //var time = "0m + (" + time + " * " + this.timeSubDiv + "n)";
        this.players[samplerIndex].sequence.remove(time);
        //console.log("touch down at " + this.xDown + ", " + this.yDown);
    },

    onDragStop: function(sprite, pointer) {
        this.setToneEventFromBubble(sprite);

    },

    setToneEventFromBubble: function(bubble) {

        var samplerIndex = (this.numPlayers - Math.floor(bubble.body.y/game.world.height * this.numPlayers))-1;
        var time = Math.floor(bubble.body.x/game.world.width * this.timeSubDiv);
        //var time = "0m + (" + time + " * " + this.timeSubDiv + "n)";
        if (samplerIndex < 0) samplerIndex = 0;
        if (samplerIndex > this.numPlayers - 1) samplerIndex = this.numPlayers - 1;
        this.players[samplerIndex].sequence.at(time, "G4"); // value G$ a dummy

        //console.log("Bubble time " + time + " pitchIndex " + pitchIndex + " and pitch " + this.pitches[pitchIndex]);
        //console.log("Looping through bubbles; time: " + time);
    }

}
