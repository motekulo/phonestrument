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
    this.instrument = this.setSoloInstrument();
    this.poly = false;  // Whether player is polyphonic


     var notes = [];
    this.part = new Tone.Part((function(time, note) {
        this.instrument.triggerAttackRelease(note, "16n");
    }).bind(this), notes);
    this.part.loop = true;
    this.part.loopEnd = "4m";
    this.part.start(0);



    this.adaptor = new SimpleBarSequencerAdaptor();
}

Player.prototype.connectToMaster = function(){

    this.instrument.connect(this.panVol);
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
            var notesToRemove = this.part.allAt(convertedData.time);
            for (i = 0; i< notesToRemove.length; i++) {
                this.part.remove(convertedData.time);
            }
        }

        this.part.add(convertedData.time,convertedData.note);


    } else if (data.level == 0) {
        this.part.remove(convertedData.time,convertedData.note);
    }

}

Player.prototype.setSamplerInstrument = function() {
    this.instrument2 = new Tone.Sampler({
        A : {
            1 : "./samples/snare_mix_1.wav"
        }
    });
    url = {
        A : {
            1 : "./samples/snare_mix_1.wav"
        }
    };
    this.instrument = new Tone.PolySynth(4, Tone.Sampler);
    this.instrument.voices[0]._loadBuffers(url);


    this.connectToMaster();
    this.poly = true;
    return this.instrument;
}

Player.prototype.setChordInstrument = function(){
    this.instrument = new Tone.PolySynth(3, Tone.SimpleSynth);

    this.connectToMaster();
    this.poly = true;
    return this.instrument;
    // FIXME What happens if an instrument is changed to a mono
    // instrument after being poly?

}

Player.prototype.setSoloInstrument = function(){
    this.instrument = new Tone.SimpleSynth();

    this.poly = false;
    this.connectToMaster();
    return this.instrument;
}

Player.prototype.getCurrentBarDataToDisplay = function(currentBar, barDiv) {
    return this.adaptor.getBarArray(this.part, currentBar, barDiv);
}
