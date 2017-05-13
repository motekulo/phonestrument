/**
 * A class that provides tonal support
 *
 * Has a key, scale structure (in semitones)
 * scale (created from key and scale structure)
 * pitches (so the 12 semitones)
 * chords
 *
 **/

function Tonality() {
    this.key = 0;
    this.scaleStructure = [2,2,1,2,2,2,1];
    this.fullScale = [];


}

/**
 * set the scale array based on scaleStructure
 * @returns {array} - an array of MIDI numbers over the full range
 *
 **/
Tonality.prototype._setScale = function(){
    for (var i = this.key; i < 128 - this.key; i++){
        this.fullScale[i] = i;
    }

}

/**
 * get a chord
 * @param {int} root - the root of the chord
 * @param {int} toChordTone - up to which tone (7th, for example)
 * @param {array} chordAlt - any alterations to the chord
 *
 **/
Tonality.prototype.getChord(root, toChordTone, chordAlt) {

}
