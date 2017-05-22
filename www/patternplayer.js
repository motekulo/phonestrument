/** @class
* A pattern player using Tone js
* Default is to create a player with a monophonic synth
**/
function PatternPlayer() {
    this.panVol = this.setPanVol();
    this.setSoloInstrument();
    //this.instrument = this.setPitchedSamplerInstrument();
    //this.instrument = this.setSamplerInstrument();


    this.setPattern();
    this.noteLength = "16n";  // length of note played by synth


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
    this.panVol.volume.value = -24; // these things are loud
    return this.instrument;
}

/**
 * set the instrument to be a pitched sample player
 * @returns {Tone.Sampler} - the instrument created
 **/
PatternPlayer.prototype.setPitchedSamplerInstrument = function() {
    var loaded = (function(){
        console.log("Loaded pitched sample");
        this.pitchedSampleLoaded = true;
    }).bind(this);
    var url = ["./assets/marimba2.wav"];  //FIXME should be passed in
    var instrument = new Tone.Sampler(url[0], loaded);
    this.isPitchedSampler = true;
    instrument.envelope.sustain = 0.4;
    return instrument;
}

 /**
  * set the instrument to be a sample player (unpitched)
  * @param {array} string - url of sample to play
  * @returns {Tone.Player} - the instrument created
  **/
PatternPlayer.prototype.setSamplerInstrument = function(url) {
    var loaded = (function(){
        console.log("Loaded pitched sample");
        this.sampleLoaded = true;
    }).bind(this);
    //var url = ["./assets/snare.wav"]; //FIXME should be passed in
    var instrument = new Tone.Player(url, loaded);
    this.isSampler = true;
    return instrument;
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

    this.pattern = new Tone.Pattern((function(time, note) {

        if (note !== undefined){
            if (this.isSampler == true) {
                this.instrument.start(time);
            } else if (this.isPitchedSampler == true) {
                var sampleBase = Tone.Frequency("F4").toMidi();
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
