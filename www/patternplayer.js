/**
* A pattern player using Tone js
*
**/

function PatternPlayer() {
    this.instrument = this.setSoloInstrument();
    this.panVol;
    this.pattern = this.setPattern;
    this.notes = []; // should be private?
    this.noteLength = "16n";  // length of note played by synth
    //this.loopLength = 1;  // number of bars to loop over
    this.interval = "8n";
}

PatternPlayer.prototype.setSoloInstrument = function() {
    this.instrument = new Tone.MonoSynth();
    this.panVol = new Tone.PanVol(0.5, -15);
    this.instrument.connect(this.panVol);
    this.panVol.connect(Tone.Master);

}

PatternPlayer.prototype.setPattern = function() {

    this.pattern = new Tone.Pattern(function(time, note) {
        this.instrument.triggerAttackRelease(Tone.Frequency(note, "midi"), this.noteLength, time);
    },[], "upDown");
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
}


function _getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
