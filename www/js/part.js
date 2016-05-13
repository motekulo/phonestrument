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


function Part() {
    var synth; 

    this.voices = [];

    this.setSynthOut = function(extsynth){
        synth = extsynth;
    }

    this.setNoteArray = function(voiceindex, time, pitch) {
        this.voices[voiceindex].at(time, pitch);
    }

    this.addVoice = function() {
        var notes = [];
        var voice = new Tone.Part(function(time,note){
            synth.triggerAttackRelease(note,"16n", time);
        }, notes);
        this.voices.push(voice);
        voice.loop = false;
        voice.start(0.5);
    };
}

