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

function SimpleBarSequencerAdaptor() {
    var octave = 4; // fudge for now
    var pitch = ["C","D","E","F"]; // fudge it for now

    // converts from:
    // Array of data in row, column, value form
    //
    // converts to:
    // voice index, time (eg "1 * 4s"), pitch (eg "C4)
    //

    this.part = null;

    this.connectToPart = function(part) {
        this.part = part;

    }

    this.convertData = function(data) {
        /* From a simple bar sequencer we get position (transport), row, column, value data

           A part expects a voice index (row, in this case), time, and pitch



*/
        if (data.length >= 4) {
            var pos = data[0];
            var row = data[1];
            var col = data[2];
            var val = data[3];

            var index = row;
            //var time = col + " * 16n";
            var time = pos + " + (" + col + " * 16n)";
            console.log("Time is " + time);
            if (val == 1) {
                note = pitch[row] + octave;
            } else {
                note = null;
            }
            var converteddata = [index, time, note];
            return converteddata;
        }

    }

    this.sendConvertedDataToPart = function(data) {
        var index = data[0]; //FIXME indexed collection would be better
        var time = data[1];
        var note = data[2];
        this.part.setNoteArray(index, time, note);
    }

    /** Queries associated part for note data for a particular bar,
     * then returns an array for the associated sequencer for
     * display purposes (so bararray[1][4]==0 means there is no
     * note to display on voice 1, 5th indicator/button on
     * sequencer).
     *
     * @param {int} bar - The bar number to query 
     * @param {division} division - The subdivision level to
     * query (so 16 is 16th note)
     * @returns - a 2 dim array of voices and notes (vaues 1 or 0)  
     **/

    this.getBarArray = function(bar, division){
        var bararray = [];
        var note;
        var time;
        for (j=0; j < this.part.voices.length; j++){
            var voicearray = [];
            for (i=0; i < division;i++){
                time = bar + "m" + " + (" + i + " * " + division + "n)";
                note = this.part.voices[j].at(time);
                if (note != null) {
                    voicearray[i] = 1;
                } else {
                    voicearray[i] = 0;
                }
                //return time;


            }
            bararray[j] = voicearray;
        }
        return bararray;

    }

}

