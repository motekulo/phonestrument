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
    this._setScale();

}


Tonality.prototype.setKey = function (key) {
    this.key = key;
    this._setScale();
}

Tonality.prototype.getKey = function () {
    return this.key;
}

Tonality.prototype.getFullScale = function () {
    return this.fullScale;
}

/**
* set the scale array based on scaleStructure
* @returns {array} - an array of MIDI numbers over the full range
*
**/
Tonality.prototype._setScale = function(){

    this.fullScale[0] = this.key;
    var index = 1;
    while (index < 128) {
        this.fullScale[index] = this.fullScale[index - 1] + this.scaleStructure[(index - 1) % this.scaleStructure.length];
        index++;
    }
//    console.log(this.fullScale);
}

/**
* get a chord
* @param {int} root - the root of the chord
* @param {int} toChordTone - up to which tone (7th, for example)
* @param {array} chordAlt - any alterations to the chord [root, 3rd,5th...]
* And yes, it's odd that theoretically here the root note could be altered :)
*
**/
Tonality.prototype.getChord = function(root, toChordTone, chordAlt) {

    var chordArray = [];
    var chordIndex = 0;
    for (var i = root - 1; i < root + this.scaleStructure.length * 2; i = i+2){
        if (i <= toChordTone + root - 1){
            chordArray[chordIndex] = this.fullScale[i];
            chordIndex++;
        }
    }
    console.log("Before alt: " + chordArray);
    // Now adjust for any chordtone alterations
    if (chordAlt.length == 0) {
        return chordArray;
    } else {
        for (var i = 0; i < chordArray.length; i++){
            chordArray[i] = chordArray[i] + chordAlt[i];
        }
        //return chordArray;
    }
    return chordArray;


}
