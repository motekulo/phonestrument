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

    //this.instrument = new Tone.SimpleSynth();
    this.instrument = new Tone.PolySynth(3, Tone.SimpleSynth);
    this.panVol = new Tone.PanVol(0.25, -12);
    this.connectToMaster();
    //this.isConnected = true;
    //instrument.connect(Tone.Master);
    
    var notes = [];
    this.part = new Tone.Part((function(time, note) {
        this.instrument.triggerAttackRelease(note, "16n");
    }).bind(this), notes);
    //this.part.at("0", "C5");
    //this.part.at("3:0:0", "G5"); // dummy values to set length of part initially
    this.part.loop = true;
    this.part.loopEnd = "4m";
    this.part.start(0);
    this.adaptor = new SimpleBarSequencerAdaptor();

}

Player.prototype.connectToMaster = function(){
    
    //this.instrument.connect(Tone.Master);
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
    //console.log("Updating data");
    var convertedData = this.adaptor.convertData(pos, data, division);
    this.part.add(convertedData[0],convertedData[1]);  // FIXME better if indexed collection
    //this.part.at(convertedData.time,convertedData.note);

}

Player.prototype.getCurrentBarDataToDisplay = function(currentBar, barDiv) {
    return this.adaptor.getBarArray(this.part, currentBar, barDiv);
}



