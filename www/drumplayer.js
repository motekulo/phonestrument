
drumPlayer = function(game) {
    this.bubbles;  // main group of bubble sprites
    this.tally = 0;
    this.bubbleScale = 0.25;
    this.xDown;
    this.yDown;
    this.sequences = [];
    this.numPlayers = 4;
    this.loaded = false;
    this.panVol = new Tone.PanVol(0.5, -18);
    // Debug things
    var vertHalfLine;
    this.timeSubDiv = 8; // resolution of time on x axis
    var options = {
        "instrument": "sampler"
    };

    var kickSequence = new Tone.Sequence((function(time, note){
        this.drumPlayer1.start(0);
    }).bind(this), ["G4", null, "G4", null, "G4", null, "G4", null], "8n");
    //var kickPart = [null, null, null, null, "G4", null, null, null];
    this.sequences.push(kickSequence);

    var snareSequence = new Tone.Sequence((function(time, note){
        this.drumPlayer2.start(1);
    }).bind(this), [null, null, "G4", null, null, null, "G4", null], "8n");
    //var snarePart = [null, null, null, null, null, null, null, null];
    this.sequences.push(snareSequence);

    var ohhSequence = new Tone.Sequence((function(time, note){
        this.drumPlayer3.start(2);
    }).bind(this), ["G4", "G4", null, "G4", "G4", "G4", null, null], "8n");
    this.sequences.push(ohhSequence);

    //var ohhPart = [null, null, null, null, null, null, null, null];
    var chhSequence = new Tone.Sequence((function(time, note){
        this.drumPlayer4.start(3);
    }).bind(this), [null, null, "G4", null, null, null, "G4", null], "8n");
    this.sequences.push(chhSequence);

    for (var i = 0; i < this.sequences.length; i++) {
        this.sequences[i].start(0);
    }
    //var chhPart = [null, null, null, null, null, null, null, null];

    var urls = ["./assets/samples/kick_mix_1.wav",
                "./assets/samples/snare_mix_1.wav",
                "./assets/samples/chh_mixed_1.wav", "./assets/samples/ohh_mixed_1.wav"];

    this.drumPlayer1 = new Tone.MultiPlayer(urls, (function() {
        this.loaded = true;
    }).bind(this));
    this.drumPlayer2 = new Tone.MultiPlayer(urls, (function() {
        this.loaded = true;
    }).bind(this));
    this.drumPlayer3 = new Tone.MultiPlayer(urls, (function() {
        this.loaded = true;
    }).bind(this));
    this.drumPlayer4 = new Tone.MultiPlayer(urls, (function() {
        this.loaded = true;
    }).bind(this));
    this.drumPlayer1.connect(this.panVol);
    this.drumPlayer2.connect(this.panVol);
    this.drumPlayer3.connect(this.panVol);
    this.drumPlayer4.connect(this.panVol);
    this.panVol.connect(Tone.Master);
};

drumPlayer.prototype = {
    preload: function() {
        //console.log("Pre-loading");
        game.load.image('bubble', 'assets/bubble256.png');
        game.load.spritesheet('playpausebutton', 'assets/pause_play_reset.png', 148, 80);
    },

    create: function() {

        // Debug:
        vertHalfLine = new Phaser.Line(game.world.width/2, 0, game.world.width/2, game.world.height);
        horHalfLine = new Phaser.Line(0, game.world.height/2, game.world.width, game.world.height/2);
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
        for (var i = 0; i < this.sequences.length; i++) {
            for (var j = 0; j < this.timeSubDiv; j++) {
                var sequenceEvent = this.sequences[i].at(j);
                if (sequenceEvent != null && sequenceEvent.value == "G4") {
                    var bubbleX = Math.floor(j/this.timeSubDiv * game.world.width) + 1;
                    var bubbleY = Math.floor((this.sequences.length - i)/this.sequences.length * game.world.height);
                    var musBubble = this.bubbles.create(bubbleX, bubbleY, 'bubble');
                    musBubble.scale.set(this.bubbleScale);
                    musBubble.anchor.set(0.5, 0.5);
                    //musBubble.x = bubbleX;
                    //musBubble.y = bubbleY;
                    musBubble.inputEnabled = true;
                    musBubble.input.enableDrag();
                    musBubble.events.onDragStart.add(this.onDragStart, this);
                    musBubble.events.onDragStop.add(this.onDragStop, this);
                    game.physics.enable(musBubble, Phaser.Physics.ARCADE);

                }
            }
        }
        //console.log("after create");
        //this.dumpAllEvents();
    },

    update: function() {

    },

    // render: function() {
    //      game.debug.geom(vertHalfLine, 'rgba(255,0,0,1)');
    //      game.debug.geom(horHalfLine, 'rgba(255,0,0,1)');
    //      game.debug.text("x body" + this.bubbles.children[0].body.x, 20, 20);
    //      game.debug.text("x sprite" + this.bubbles.children[0].x, 20, 40);
    // },

    onDragStart: function(bubble, pointer) {
        this.xDown = pointer.x;
        this.yDown = pointer.y;
        // remove current part at this time pointer
        var samplerIndex = (Math.floor((game.world.height - bubble.y)/game.world.height * this.numPlayers));
        var time = Math.floor(bubble.x/game.world.width * this.timeSubDiv);
        if (samplerIndex < 0) samplerIndex = 0;
        if (samplerIndex > this.numPlayers - 1) samplerIndex = this.numPlayers - 1;
        //var time = "0m + (" + time + " * " + this.timeSubDiv + "n)";
        console.log("Removing index " + samplerIndex + " at time " + time);
        this.sequences[samplerIndex].remove(time);
        //this.players[samplerIndex].sequence.at(time, "rest");
        //this.dumpAllEvents();
        //console.log("touch down at " + this.xDown + ", " + this.yDown);
        //console.log("Bubble.x is " + bubble.x);

    },

    onDragStop: function(sprite, pointer) {
        this.setToneEventFromBubble(sprite);

    },

    setToneEventFromBubble: function(bubble) {

        var samplerIndex = (Math.floor((game.world.height - bubble.y)/game.world.height * this.numPlayers));
        var time = Math.floor(bubble.x/game.world.width * this.timeSubDiv);
        //var time = "0m + (" + time + " * " + this.timeSubDiv + "n)";
        if (samplerIndex < 0) samplerIndex = 0;
        if (samplerIndex > this.numPlayers - 1) samplerIndex = this.numPlayers - 1;
        this.sequences[samplerIndex].at(time, "G4"); // value G$ a dummy
        //console.log("After drag");
        //this.dumpAllEvents();
        //console.log("adding index " + samplerIndex + " at time " + time);
        //console.log("Bubble time " + time + " pitchIndex " + pitchIndex + " and pitch " + this.pitches[pitchIndex]);
        //console.log("Looping through bubbles; time: " + time);
    },

    dumpAllEvents: function() {
        for (var k = 0; k < this.numPlayers; k++) {
            console.log("Player " + k);
            for (var i = 0; i < this.timeSubDiv; i++){
                var eventVal = this.sequences[k].at(i);
                if (eventVal != null) {
                    console.log("event value " + i + " is " + eventVal.value);
                } else {
                    console.log("event " + i + " is " + eventVal);
                }
            }
        }
    }
}
