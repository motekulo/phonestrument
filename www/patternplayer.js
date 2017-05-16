/**
* A pattern player using Tone js
*
**/

function PatternPlayer() {
    this.instrument = this.setSoloInstrument();
    this.panVol = this.setPanVol();
    this.instrument.connect(this.panVol);
    this.panVol.connect(Tone.Master);
    this.interval = "8n";
    this.setPattern();
    this.notes = []; // should be private?
    this.noteLength = "16n";  // length of note played by synth
    //this.loopLength = 1;  // number of bars to loop over

}

PatternPlayer.prototype.setSoloInstrument = function() {
    var instrument = new Tone.MonoSynth();
    return instrument;

}

PatternPlayer.prototype.setPanVol = function() {
    var panVol = new Tone.PanVol(0.5, -15);
    return panVol;
}
PatternPlayer.prototype.setPattern = function() {
    self = this;
    this.pattern = new Tone.Pattern(function(time, note) {
        self.instrument.triggerAttackRelease(Tone.Frequency(note, "midi"), self.noteLength, time);
    },[24], "upDown");
    this.pattern.interval = this.interval;
    this.pattern.start(0);
}

/**
* set the pattern notes
* @param {array} notes - the array of midi notes to set
*
**/
PatternPlayer.prototype.setNotes = function(notes) {
    this.notes = notes;
    this.pattern.values = notes;

}

/**
 * change the loop interval
 * @param {string} newInterval - new interval as Tone note notation ("4n")
 *
 **/
 PatternPlayer.prototype.setLoopInterval = function(newInterval) {
     this.interval = newInterval;
     this.pattern.interval = this.interval;
 }

/**
* replace a random note in a pattern
* @param {note} note - the midi note of the note to insert
*
**/
PatternPlayer.prototype.randomReplaceNote = function(note) {
    var index = _getRandomIntInclusive(0, this.notes.length - 1);
    this.notes[index] = note;
    this.pattern.values = this.notes;   //FIXME Why do we need this.notes at all?
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
