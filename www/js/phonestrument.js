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
    //this.parts

    var currentbarnum = 0;
    var currentpos = 0;

    /** Schedule a regular start of bar notification to a bar
     * sequencer, so that it can draw itself
     *
     **/
    Phonestrument.prototype.schedulePing = function(callback, interval){
        Tone.Transport.scheduleRepeat(function(time){
            //console.log("Bar: " + currentbarnum);
            currentpos = Tone.Transport.position;
            console.log("Bar: " + currentpos);
            //barseq.setCurrentBarNum(currentpos);
            //sampleseq.setCurrentBarNum(currentpos);
            currentbarnum++;
            callback("ping");
           // tfl_bar.setValue(currentpos);
        }, "1m");
    }
    
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = "4m";
    Tone.Transport.bpm.value = 60;

    console.log("New phonestrument ready");

}

Phonestrument.prototype.startPlaying = function(){
    Tone.Transport.start();
}

Phonestrument.prototype.stopPlaying = function(){
    Tone.Transport.stop();
}

Phonestrument.prototype.createNewPlayer = function(){

    var newPlayer = new Player();
    this.player.push(newPlayer);

}


Phonestrument.prototype.beepToTest = function(){
    var synth = new Tone.MonoSynth().ToMaster();
    synth.triggerAttackRelease("G4", "8n");
}







