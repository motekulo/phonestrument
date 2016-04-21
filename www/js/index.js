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

var drumpitches =  ["C2","D3","E4","F2"];
var timestring = "";
var synth = new Array(4);
var note = new Array(4);
//var row = new Array(16);
var dist = new Tone.Distortion().toMaster();
var mcontext;
var recorder;

recorder = new Recorder(dist);


document.addEventListener("deviceready", function(event) {

    try {
        mcontext = Tone.context;
        console.log("Loaded");
    } catch (e) {
        alert('No web audio support in this browser!');
    }

    for (i = 0; i < 4; i++){
        //synth[i] = new Tone.DrumSynth().toMaster();
        synth[i] = new Tone.DrumSynth().connect(dist);
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
    var v1 = new Interface.Slider({
        target: synth[0],
        key: 'volume',
        min: -36,
        max: 6,
        label: 'Vol',
        bounds: [0.15, 0.05, 0.05, 0.2],
        onvaluechange : function() {
            synth[0].volume.value = this.value;
            console.log("this.value " + this.value);
        }
    });
    var v2 = new Interface.Slider({
        target: synth[1],
        key: 'volume',
        min: -36,
        max: 6,
        label: 'Vol',
        bounds: [0.15, 0.25, 0.05, 0.2],
        onvaluechange : function() {
            synth[1].volume.value = this.value;
            console.log("this.value " + this.value);
        }
    });
    var v3 = new Interface.Slider({
        target: synth[2],
        key: 'volume',
        min: -36,
        max: 6,
        label: 'Vol',
        bounds: [0.15, 0.45, 0.05, 0.2],
        onvaluechange : function() {
            synth[2].volume.value = this.value;
            console.log("this.value " + this.value);
        }
    });
    var v4 = new Interface.Slider({
        target: synth[3],
        key: 'volume',
        min: -36,
        max: 6,
        label: 'Vol',
        bounds: [0.15, 0.65, 0.05, 0.2],
        onvaluechange : function() {
            synth[3].volume.value = this.value;
            console.log("this.value " + this.value);
        }
    });
    var a = new Interface.Panel({ 
        container:document.querySelector("#InterfacePanel") 
    });

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
        bounds: [0.85, 0.05, 0.04, 0.2],
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
        bounds: [0.85, 0.25, 0.04, 0.2],
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
        bounds: [0.85, 0.45, 0.04, 0.2],
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
        bounds: [0.85, 0.65, 0.04, 0.2],
        onvaluechange : function() {
            synth[3].octaves.value = this.value;
            console.log("this.value " + this.value);
        }
    });
    var d1 = new Interface.Slider({
        target: synth[0],
        key: 'distortion',
        min: 0,
        max: 1,
        label: 'dist',
        bounds: [0.90, 0.05, 0.04, 0.2],
        onvaluechange : function() {
            dist.wet.value = this.value;
            console.log("this.value " + this.value);
        }
    });
    a.add(b, v1, v2, v3, v4, multiButton, so1, so2, so3, so4, d1);


});

function startRecording(button) {
    recorder && recorder.record();
    button.disabled = true;
    button.nextElementSibling.disabled = false;
    console.log('Recording...');
}

function stopRecording(button) {
    recorder && recorder.stop();
    button.disabled = true;
    button.previousElementSibling.disabled = false;
    console.log('Stopped recording.');
    // create WAV download link using audio data blob
    createDownloadLink();
    //    recorder.clear();
}

function createDownloadLink() {
    recorder && recorder.exportWAV(function(blob) {
        var isAndroid = true;
        var url = "";
        console.log("file system is " + cordova.file.externalDataDirectory);
        if (!cordova.file.externalDataDirectory) {
            isAndroid = false;
        }
        if (isAndroid == true) {

            window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {
                //            console.log("dir is ",dir);
                console.log("Blob size is " + blob.size);
                dir.getFile("test.wav", {create:true}, function(file) {
                    console.log("file url will be " + file.nativeURL);
                    url = file.nativeURL;
                    file.createWriter(function(fileWriter) {
                        fileWriter.seek(fileWriter.length);
                        fileWriter.write(blob);
                        console.log("File written to storage");

                    });
                });


            });

        } else {
            var url = URL.createObjectURL(blob);
        }
        var li = document.createElement('li');
        var au = document.createElement('audio');
        var hf = document.createElement('a');
        au.controls = true;
        au.src = url;
        hf.href = url;
        hf.download = new Date().toISOString() + '.wav';
        hf.innerHTML = hf.download;
        li.appendChild(au);
        li.appendChild(hf);
        recordingslist.appendChild(li);

    });
}




