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
 * A Phonestrument is the main controller for the application. It draws the
 * main (home) screen, and controls how components are connected together. Most
 * of the action takes place in the callbacks from the Interface widgets.
 *
 **/
/** 
 * Constructor of a new Phonestrument
 * 
 * @param {tempo}
 * @param {timesig}
 * @param {key}
 * @param {numparts}
 *
 **/

function Phonestrument(tempo, timesig, key, numparts){

    this.tempo = tempo;
    this.timesig = timesig;
    this.key = key;
    this.player = [];

    for (var i = 0; i < numparts; i++) {
        this.createNewPlayer();
    }
    this.currentPlayer = this.player[0];

    this.currentBar = "";

     Tone.Transport.scheduleRepeat(function(time){
            this.currentBar = Tone.Transport.position;
            //console.log("Bar: " + this.currentBar);
            
        }, "1m");
    
    /** Schedule a regular start of bar notification to a bar
     * sequencer, so that it can draw itself
     *
     **/
   
    
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = "4m";
    Tone.Transport.bpm.value = 116;

    console.log("New phonestrument ready");

}

Phonestrument.prototype.getCurrentBar = function(){
    var bar = this.currentBar;
    return bar;
}

Phonestrument.prototype.schedulePing = function(callback, interval){
    Tone.Transport.scheduleRepeat(function(time){
        callback(Tone.Transport.position);
    }, "1m");
}

Phonestrument.prototype.startPlaying = function(){
    Tone.Transport.start();
}

Phonestrument.prototype.stopPlaying = function(){
    Tone.Transport.stop();
}

Phonestrument.prototype.pausePlaying = function(){
    Tone.Transport.pause();
}

Phonestrument.prototype.createNewPlayer = function(){

    var newPlayer = new Player();
    this.player.push(newPlayer);

}

Phonestrument.prototype.changeTempo = function(tempo){
    Tone.Transport.bpm.value = tempo;
}

Phonestrument.prototype.beepToTest = function(){
    var synth = new Tone.MonoSynth().ToMaster();
    synth.triggerAttackRelease("G4", "8n");
}







