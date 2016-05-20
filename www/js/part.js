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
    var notes = [];
    this.tonepart = new Tone.Part(function(time,note){
        //console.log("Time: "+ time + "and Note: " + note);
        //synth.triggerAttackRelease(note,"16n");
        synth.triggerDrum(note);
        //synth.triggerAttackRelease(note,"16n", time);
    }, notes);
    this.tonepart.loop = false;
    this.tonepart.start(0.2);

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

}

