/*
 *
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

function Barsequencer() {

    var pitches =  ["C4","D4","E4","F4"];
    var timestring = "";
    var line = new Array(4);
    var synth;// = new Tone.MonoSynth();
    var part;
//    var part = new Part();
 //   part.setSynth();
  //  part.connectSynthToMainOut();

    this.setSynthOut = function(extsynth){
        synth = extsynth;
    }

    this.draw = function(panel){
        panel.add(b, multiButton);
    };

    //    for (i = 0; i < 4; i++){
    //synth[i] = new Tone.DrumSynth().toMaster();
    //   }
    //var seq = new Tone.Sequence(callback, ["C3", "Eb3", "F4", "Bb4"], "8n");
    this.initInternalPart = function(){
        for (j = 0; j < 4; j++) {
            //note[j] = [,,,,,,,,,,,,,,,];

            var initialArray = new Array(16);
            for (i = 0; i < 16; i++) {
                beatstring = i + " * 16n";
                initialArray[i] = [beatstring, null];
            }

            line[j] = new Tone.Part(function(time, note){
                console.log("Triggered");
                synth.triggerAttackRelease(note, "16n", time);
            }, initialArray);

            // line[j] = part.addVoice();

            line[j].loop = true;
            line[j].start(1);
        }
    };

    this.initExternalPart = function(extpart){
        part = extpart; 
        for (j = 0; j < 4; j++) {
            part.addVoice();
            //line[j].loop = true;
            //line[j].start(1);
        }
    }

    // Interface section //////////////////////////////////////////////////////
    var b = new Interface.Button({ 
        bounds:[.05,.15,.1,.1],  
        label:'On/Off',
        onvaluechange : function() {
            console.log("Value: " + this.value)
                if (this.value == 1) {
                    Tone.Transport.start();
                } else {
                    Tone.Transport.stop();
                }
        }
    });

    var multiButton = new Interface.MultiButton({
        rows:4, columns:16,
        bounds:[.2,.15,.6,.6],
        onvaluechange : function(row, col, value) {
            console.log( 'row : ' + row + ' , col : ' + col + ' , value : ' + value);
            //timestring = "0:0:" + col;
            //beatstring = col + " * " + "16n";
            //console.log("beatstring: " + beatstring);
            part.setNoteArray(row, col, value);
        }
    });
}





