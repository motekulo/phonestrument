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

document.addEventListener("deviceready", function(event) {

    var drumpitches =  ["C2","D3","E4","F2"];
    var timestring = "";

    var synth = new Array(4);
    var note = new Array(4);
    //var row = new Array(16);


    for (i = 0; i < 4; i++){
        synth[i] = new Tone.DrumSynth().toMaster();
    }


    for (j = 0; j < 4; j++) {

        note[j] = [,,,,,,,,,,,,,,,];
        for (i = 0; i < 16; i++) {

            /* Weird switch construct, because simply passing in j as the index to
               the array in the callback fails. So this doesn't work (because j is
               undefined when called back I guess?).:

               note[j][i] = new Tone.Event(function(time, pitch){
               synth[j].triggerAttackRelease(pitch, "16n", time);
               }, drumpitches[j]);

            // have tried j.valueOf() as well to no avail

*/

            switch(j) {
                case 0: {
                    note[j][i] = new Tone.Event(function(time, pitch){
                        synth[0].triggerAttackRelease(pitch, "16n", time);
                    }, drumpitches[0]);
                    break;
                }
                case 1: {
                    note[j][i] = new Tone.Event(function(time, pitch){
                        synth[1].triggerAttackRelease(pitch, "16n", time);
                    }, drumpitches[1]);
                    break;
                }
                case 2: {
                    note[j][i] = new Tone.Event(function(time, pitch){
                        synth[2].triggerAttackRelease(pitch, "16n", time);
                    }, drumpitches[2]);
                    break;
                }
                case 3: {
                    note[j][i] = new Tone.Event(function(time, pitch){
                        synth[3].triggerAttackRelease(pitch, "16n", time);
                    }, drumpitches[3]);
                    break;
                }
            }

            note[j][i].set({
                "loop" : true,
                "loopEnd" : "1m"
            });

        }
    }

    // Interface section

    var b = new Interface.Button({ 
        bounds:[.05,.05,.1,.1],  
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


    var a = new Interface.Panel();
    var multiButton = new Interface.MultiButton({
        rows:4, columns:16,
        bounds:[.2,.05,.6,.8],
        onvaluechange : function(row, col, value) {
            console.log( 'row : ' + row + ' , col : ' + col + ' , value : ' + value);
            timestring = "0:0:" + col;
            console.log("timestring: " + timestring);
            if (value == 1) {
                note[row][col].start(timestring);
            } else {
                note[row][col].stop();
            }

        },
    });

    a.background = 'black';

    var so1 = new Interface.Slider({
        target: synth[0],
        key: 'octaves',
        min: 0,
        max: 20,
        label: '8ves',
        bounds: [0.85, 0.05, 0.08, 0.2],
        onvaluechange : function() {
            synth[0].octaves.value = this.value;
            console.log("this.value " + this.value);
        }
    });

    var so2 = new Interface.Slider({
        target: synth[1],
        key: 'octaves',
        min: 0,
        max: 20,
        label: '8ves',
        bounds: [0.85, 0.25, 0.08, 0.2],
        onvaluechange : function() {
            synth[1].octaves.value = this.value;
            console.log("this.value " + this.value);
        }
    });

    var so3 = new Interface.Slider({
        target: synth[2],
        key: 'octaves',
        min: 0,
        max: 20,
        label: '8ves',
        bounds: [0.85, 0.45, 0.08, 0.2],
        onvaluechange : function() {
            synth[2].octaves.value = this.value;
            console.log("this.value " + this.value);
        }
    });

    var so4 = new Interface.Slider({
        target: synth[3],
        key: 'octaves',
        min: 0,
        max: 20,
        label: '8ves',
        bounds: [0.85, 0.65, 0.08, 0.2],
        onvaluechange : function() {
            synth[3].octaves.value = this.value;
            console.log("this.value " + this.value);
        }
    });


    a.add(b, multiButton, so1, so2, so3, so4);

    //for(var i = 0; i < multiButton.count; i++) {
    //    multiButton._values[i] = Math.random() > .5 ;
    //}
    //




});


