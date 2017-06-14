/** @class
* A SequencePlayer is a Tone js instrument that plays a Tone js Tone.Sequence.
* A SequencePlayer's instrument can be changed, and the class
* takes care of connections to the master audio bus Tone.Master.
* The default is to create a player with a monophonic synth
* @param {opbject} options - json object of options in the format
* @example
* options take the form of {"instrument": "solo", "sequence": []};
* instrument options either "solo", "sampler" or "pitchedSampler"
**/
function SequencePlayer(options) {
    this.panVol = this.setPanVol();
    this.subDiv = 8;  // FIXME should be able to be added in options
    // empty sequence array at subDiv:
    var sequenceValues = Array(this.subDiv).fill(null);
    if (options.sequence != null) {
        sequenceValues = options.sequence;
    }

    if (options.instrument == null) {
        options = SequencePlayer.defaults;
    }
    switch (options.instrument) {
        case "solo" :
            this.setSoloInstrument();
            this.sequence = new Tone.Sequence((function(time, note) {
                if (note !== undefined){
                    this.instrument.triggerAttackRelease(Tone.Frequency(note, "midi"), this.noteLength, time);
                }
            }).bind(this),sequenceValues, this.subDiv + "n");
            break;

        case "sampler" :
            this.instrument = this.setSamplerInstrument(options.url);
            this.sequence = new Tone.Sequence((function(time, note) {
                if (note !== undefined){
                    this.instrument.start(time);
                }
            }).bind(this),sequenceValues, this.subDiv + "n");
            //this.instrument.sync();
            break;

        case "pitchedSampler" :
            this.instrument = this.setPitchedSamplerInstrument();
            var sampleBase = Tone.Frequency("C4").toMidi();
            this.sequence = new Tone.Sequence((function(time, note) {
                if (note !== undefined){
                    var interval = note - sampleBase;
                    this.instrument.triggerAttack(interval);

                    }
            }).bind(this),sequenceValues, this.subDiv + "n");
            break;
    }

    this.sequence.start(0);
    this.sampleLoaded = false;
    this.pitchedSampleLoaded = false;
    this.noteLength = "16n";  // length of note played by synth

}

SequencePlayer.defaults = {
    "instrument" : "solo"
}

/**
 * set the instrument to be a monophonic synth
 * @returns {Tone.Monophonic} - the instrument created
 **/
SequencePlayer.prototype.setSoloInstrument = function() {
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
SequencePlayer.prototype.setPitchedSamplerInstrument = function() {
    var loaded = (function(){
        //console.log("Loaded pitched sample");
        this.pitchedSampleLoaded = true;
    }).bind(this);
    var url = ["./assets/samples/bass.wav"];  //FIXME should be passed in
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
SequencePlayer.prototype.setSamplerInstrument = function(url) {
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
SequencePlayer.prototype.setPanVol = function() {
    var panVol = new Tone.PanVol(0.5, -18);
    return panVol;
}

/**
 * Connect instrument to master bus (Tone.Master)
 * Goes through the object's pnVol first
 *
 **/
SequencePlayer.prototype.connectToMaster = function(instrument){
    instrument.connect(this.panVol);
    //this.instrument.connect(this.panVol);
    this.panVol.connect(Tone.Master);
    this.isConnected = true;
}

/**
 * Disconnect instrument from master bus (Tone.Master)
 *
 **/
SequencePlayer.prototype.disconnectFromMaster = function(){
    this.instrument.disconnect();
    this.panVol.disconnect();
    this.isConnected = false;
}


/**
 * pan the sequence
 * @param {float} panPos - the pan value (between 0 and 1)
 *
 **/
 SequencePlayer.prototype.setPanPosition = function(panPos) {
     this.panVol.pan.value = panPos;
 }
