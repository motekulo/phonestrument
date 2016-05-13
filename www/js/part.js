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

/**
 * A Part stores and recalls Tone.Part information for a single instrument.
 * This might have a single voice (a bass, for example), or a number of voices
 * (from a poysynth, perhaps). 
 *
 **/
function Part() { 

    var synth; 

    // FIXME - voices ends up as a 2d array, but doesn't have to be given
    // Tone.Part structure; it is done like this at the moment to easily
    // transfer note info across to a sequencer.  

    this.voices = []; 

    /**
     *
     * Sets the synth that this Part will output to
     *
     * @params {synth} - the synth to connect to
     *
     **/
    this.setSynthOut = function(extsynth){
        synth = extsynth;
    }

    /**
     * Writes note data to the part
     *
     * @params {voiceindex} - index of the voice to write to
     * @params {time} - time info in Tone.js format for the note
     * @params {pitch} - pitch of note to write (C4 style)
     *
     **/
    this.setNoteArray = function(voiceindex, time, pitch) {
        this.voices[voiceindex].at(time, pitch);
    }

    /**
     * Add a voice to the part
     *
     **/
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

