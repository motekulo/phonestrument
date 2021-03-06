/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/


/**
* Constructor of a new Player for the Phonestrument
*
* @param {}
*
**/

function Player(){
    this.panVol = new Tone.PanVol(0.25, -12);
    this.instrument = this.setSoloInstrument();  // the default instrument
    this.sampler = [];
    this.samplesLoaded = false;
    this.pitchedSampleLoaded = false;
    this.poly = false;  // Whether player is polyphonic
    this.maxDivisionResolution = 16; // The highest resolution in beats of the part
    this.interfaceInfo = {"stage": {
                                    "xpos": 0,
                                    "ypos": 0,
                                    "color": ""
                                    }
                        };

    notes = [];
    this.part = new Tone.Part((function(time, note) {
        if (this.isPitchedSampler && this.pitchedSampleLoaded) {
            console.log("Pitched sampler happening");
            var sampleBase = Tone.Frequency("C4").toMidi();
            var currentNote = Tone.Frequency(note).toMidi();
            var interval = currentNote - sampleBase;
            this.instrument.triggerAttack(interval);
        };
        if (this.isSampler && this.samplesLoaded) {
            console.log("We are a sampler; note is " + note);
            if (note == "C4") this.sampler[0].start();
            if (note == "D4") this.sampler[1].start();
            if (note == "E4") this.sampler[2].start();
            if (note == "F4") this.sampler[3].start();
            //this.instrument.triggerAttackRelease(note, "16n");
        };

        if (!this.isSampler && !this.isPitchedSampler) {
            this.instrument.triggerAttackRelease(note, "16n");
        };

    }).bind(this), notes);
    this.part.loop = true;
    this.length = 4; //length in bars
    this.part.loopEnd = this.length + "m";
    //this.part.loopEnd = "4m";
    this.part.start(0);

    // Adaptor knows how to display data, and how to provide the part with data
    // in the correct format; it adapts between the view, and the part in this player

    this.adaptor = new SimpleBarSequencerAdaptor();
}

Player.prototype.connectToMaster = function(instrument){
    instrument.connect(this.panVol);
    //this.instrument.connect(this.panVol);
    this.panVol.connect(Tone.Master);
    this.isConnected = true;
}

Player.prototype.disconnectFromMaster = function(){
    this.instrument.disconnect();
    this.panVol.disconnect();
    this.isConnected = false;
}

Player.prototype.setAdaptor = function(adaptor){
    this.adaptor = adaptor;

}

Player.prototype.changeInstrument = function(instrument){
    this.instrument = instrument;

}

Player.prototype.updatePart = function(pos, data, division){
    var convertedData = this.adaptor.convertData(pos, data, division);
    if (data.level == 1) {
        // If monophonic instrument, remove old notes
        if (this.poly == false) {
            var notesToRemove = this.part.at(convertedData.time);
            if (notesToRemove != null) {
                for (i = 0; i< notesToRemove.length; i++) {
                    this.part.remove(convertedData.time);
                }
            }
        }
        this.part.add(convertedData.time,convertedData.note);
    } else if (data.level == 0) {
        this.part.remove(convertedData.time,convertedData.note);
    }

}

Player.prototype.updatePartView = function(bar, col, matrix, division){
    // FIXME Should this be in the adaptor, given that a matrix - so something
    // quite specific to a particular view of the data is being passed in?
    this.adaptor.updateViewData(bar, col, matrix, division);
}

Player.prototype.setPitchedSamplerInstrument = function () {
    var loaded = (function(){

        console.log("Loaded pitched sample");
        this.pitchedSampleLoaded = true;

    }).bind(this);
    var url = ["./samples/bass.wav"];
    this.instrument = new Tone.Sampler(url[0], loaded);
    this.instrument.envelope.sustain = 0.4;
    this.connectToMaster(this.instrument);
    this.isPitchedSampler = true;
    this.isSampler = false;  //FIXME sort out better logic for this
}

Player.prototype.setSamplerInstrument = function() {
    // callback for when samples are loaded
    var loaded = (function(){
        numSamplesLoaded++;
        console.log("Loaded number + " + numSamplesLoaded);
        if (numSamplesLoaded == 4) {
            this.samplesLoaded = true;
        }

    }).bind(this);
    var url = ["./samples/kick_mix_1.wav",
    "./samples/snare_mix_1.wav",
    "./samples/ohh_mixed_1.wav",
    "./samples/chh_mixed_1.wav"];

    //this.instrument = new Tone.PolySynth(4, Tone.Sampler);
    numSamplesLoaded = 0;
    for (var i=0; i < 4; i++) {
        this.sampler[i] = new Tone.Player(url[i], loaded);
        this.connectToMaster(this.sampler[i]);
        //this.sampler[i].toMaster();
        this.sampler[i].retrigger = true;
    }


    this.poly = true;
    this.isSampler = true;
    this.isPitchedSampler = false;

    //return this.instrument;
}

Player.prototype.setChordInstrument = function(){
    this.instrument = new Tone.PolySynth(3, Tone.SimpleSynth);

    this.connectToMaster(this.instrument);
    this.poly = true;
    this.isSampler = false;
    this.isPitchedSampler = false;
    return this.instrument;
    // FIXME What happens if an instrument is changed to a mono
    // instrument after being poly?

}

Player.prototype.setSoloInstrument = function(){
    this.instrument = new Tone.SimpleSynth();

    this.poly = false;
    this.isSampler = false;
    this.isPitchedSampler = false;
    this.connectToMaster(this.instrument);
    return this.instrument;
}

Player.prototype.getCurrentBarDataToDisplay = function(currentBar, barDiv) {
    return this.adaptor.getBarArray(currentBar, barDiv);

}

Player.prototype.adjustPartLength = function(newLength) {

    var adj = newLength - this.length;
    this.adaptor.adjustViewArray(adj);
    this.length = newLength; //length in bars
    this.part.loopEnd = this.length + "m";

}
