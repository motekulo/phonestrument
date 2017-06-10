/** @class
* A PatternPlayer is a Tone js instrument that plays a Tone js Tone.Pattern.
* A PatternPlayer's instrument can be changed, and the class
* takes care of connections to the master audio bus Tone.Master.
* The default is to create a player with a monophonic synth
* @param {opbject} options - json object of options in the format
* @example
* options take the form of {"instrument": "solo"};
* instrument options either "solo", "sampler" or "pitchedSampler"
**/
function PatternPlayer(options) {
    this.panVol = this.setPanVol();

    if (options.instrument == null) {
        options = PatternPlayer.defaults;
    }
    switch (options.instrument) {
        case "solo" :
            this.setSoloInstrument();
            this.pattern = new Tone.Pattern((function(time, note) {
                if (note !== undefined){
                    this.instrument.triggerAttackRelease(Tone.Frequency(note, "midi"), this.noteLength, time);
                }
            }).bind(this),[24], "upDown");
            break;

        case "sampler" :
            this.instrument = this.setSamplerInstrument(options.url);
            this.pattern = new Tone.Pattern((function(time, note) {
                if (note !== undefined){
                    this.instrument.start(time);
                }
            }).bind(this),[24], "upDown");
            break;

        case "pitchedSampler" :
            this.instrument = this.setPitchedSamplerInstrument();
            var sampleBase = Tone.Frequency("G4").toMidi();
            this.pattern = new Tone.Pattern((function(time, note) {
                if (note !== undefined){
                    var interval = note - sampleBase;
                    this.instrument.triggerAttack(interval);

                    }
            }).bind(this),[24], "upDown");
            break;
    }

    //this.setPattern();
    this.pattern.interval = "8n";  // default for init
    this.pattern.start(0);
    this.sampleLoaded = false;
    this.pitchedSampleLoaded = false;
    this.noteLength = "16n";  // length of note played by synth

}

PatternPlayer.defaults = {
    "instrument" : "solo"
}

/**
 * set the instrument to be a monophonic synth
 * @returns {Tone.Monophonic} - the instrument created
 **/
PatternPlayer.prototype.setSoloInstrument = function() {
    this.instrument = new Tone.MonoSynth();
    this.isPitchedSampler = false;
    this.isSampler = false;
    this.connectToMaster(this.instrument);
    this.panVol.volume.value = -30; // these things are loud
    return this.instrument;
}

/**
 * set the instrument to be a pitched sample player
 * @returns {Tone.Sampler} - the instrument created
 **/
PatternPlayer.prototype.setPitchedSamplerInstrument = function() {
    var loaded = (function(){
        //console.log("Loaded pitched sample");
        this.pitchedSampleLoaded = true;
    }).bind(this);
    var url = ["./assets/samples/marimba_g4.wav"];  //FIXME should be passed in
    this.instrument = new Tone.Sampler(url[0], loaded);
    this.isPitchedSampler = true;
    this.instrument.envelope.sustain = 0.4;
    this.panVol.volume.value = -15;
    this.connectToMaster(this.instrument);
    return this.instrument;
}

 /**
  * set the instrument to be a sample player (unpitched)
  * @param {array} string - url of sample to play
  * @returns {Tone.Player} - the instrument created
  **/
PatternPlayer.prototype.setSamplerInstrument = function(url) {
    var loaded = (function(){
        //console.log("Loaded sample");
        this.sampleLoaded = true;
    }).bind(this);
    //var url = ["./assets/snare.wav"]; //FIXME should be passed in
    this.instrument = new Tone.Player(url, loaded);
    this.instrument.retrigger = true;
    this.connectToMaster(this.instrument);
    this.panVol.volume.value = -15;
    this.isSampler = true;
    return this.instrument;
}

/**
 * create a panner and volume combined
 * @returns {Tone.PanVol} - the panvol object created
 **/
PatternPlayer.prototype.setPanVol = function() {
    var panVol = new Tone.PanVol(0.5, -18);
    return panVol;
}

/**
 * Connect instrument to master bus (Tone.Master)
 * Goes through the object's pnVol first
 *
 **/
PatternPlayer.prototype.connectToMaster = function(instrument){
    instrument.connect(this.panVol);
    //this.instrument.connect(this.panVol);
    this.panVol.connect(Tone.Master);
    this.isConnected = true;
}

/**
 * Disconnect instrument from master bus (Tone.Master)
 *
 **/
PatternPlayer.prototype.disconnectFromMaster = function(){
    this.instrument.disconnect();
    this.panVol.disconnect();
    this.isConnected = false;
}


PatternPlayer.prototype.setPattern = function() {
    var sampleBase = Tone.Frequency("G4").toMidi();

    this.pattern = new Tone.Pattern((function(time, note) {
        if (note !== undefined){
            if (this.isSampler == true && this.sampleLoaded == true) {
                this.instrument.start(time);
            } else if (this.isPitchedSampler == true && this.pitchedSampleLoaded == true) {

                var interval = note - sampleBase;
                this.instrument.triggerAttack(interval);
            } else {

                this.instrument.triggerAttackRelease(Tone.Frequency(note, "midi"), this.noteLength, time);
            }
        }
    }).bind(this),[24], "upDown");
    this.pattern.interval = "8n";  // default for init
    this.pattern.start(0);
}

/**
* set the pattern notes
* @param {array} notes - the array of midi notes to set
* @memberof PatternPlayer.prototype
**/
PatternPlayer.prototype.setNotes = function(notes) {
    //this.notes = notes;
    this.pattern.values = notes;

}

/**
 * change the loop interval
 * @param {string} newInterval - new interval as Tone note notation ("4n")
 *
 **/
 PatternPlayer.prototype.setLoopInterval = function(newInterval) {
     //this.interval = newInterval;
     this.pattern.interval = newInterval;
 }

/**
* replace a random note in a pattern
* @param {note} note - the midi note of the note to insert
* @returns {int} - the index of the random array item changed
**/
PatternPlayer.prototype.randomReplaceNote = function(note) {
    var index = _getRandomIntInclusive(0, this.pattern.values.length - 1);
    //this.notes[index] = note;
    this.pattern.values[index] = note;   //FIXME Why do we need this.notes at all?
    return index;
}

/**
 * change the pattern type randomly
 * @returns {string} - the pattern type changed to
 **/
PatternPlayer.prototype.changePatternTypeRandomly = function() {
    var types = ["up", "down", "upDown", "downUp", "alternateUp", "alternateDown",
    "random", "randomWalk", "randomOnce"];
    var currentType = this.pattern.pattern;
    do {
        randomIndex = _getRandomIntInclusive(0, types.length - 1);
        var newType = types[randomIndex];
    } while (newType == currentType);  // ust return a different random type
    this.pattern.pattern = newType;
    return newType;
}

/**
 * pan the pattern
 * @param {float} panPos - the pan value (between 0 and 1)
 *
 **/
 PatternPlayer.prototype.setPanPosition = function(panPos) {
     this.panVol.pan.value = panPos;
 }

function _getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
