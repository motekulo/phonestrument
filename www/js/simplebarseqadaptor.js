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
 * A simple adaptor that connects a bar sequencer to its associated
 * part. An adaptor is able to convert part information into a format
 * useful for a sequencer. The idea here being that a sequencer is
 * simply a view, and a part a means of storing musical information.
 * The adaptor sits in between
 **/
function SimpleBarSequencerAdaptor() {
    this.notesinscale = 4;
    this.scalestructure = [2,2,1];
    this.key = "C";
    this.scale = [];
    this.octave = 4; // fudge for now
    var pitch = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]; 

    this.setScale = function(key){
        var scale = [];
        var start = pitch.indexOf(key);
        scale.push(pitch[start]);
        var prevnoteindex = start;
        for (i = 0; i < this.scalestructure.length; i++) {
            nextnoteindex = prevnoteindex + this.scalestructure[i];
            if (nextnoteindex >= pitch.length) {
                nextnoteindex = nextnoteindex - pitch.length; // wrap
            }
            scale.push(pitch[nextnoteindex]); 
            prevnoteindex = nextnoteindex;        
        }
        this.scale = scale;
        return scale
    }


    // converts from:
    // Array of data in row, column, value form
    //
    // converts to:
    // voice index, time (eg "1 * 4s"), pitch (eg "C4)
    //

    this.part = null;

    /**
     * Connects to the part that it needs to write to and extract
     * information from.
     *
     * @params {Part} the part to connect to
     *
     **/
    this.connectToPart = function(part) {
        this.part = part;

    }

    /**
     *
     * Convert data from a form output by the sequencer, to a form usable
     * by a Part.  From a simple bar sequencer we get position
     * (transport), row, column, value data. A part expects a voice index
     * (row, in this case), time, *and pitch
     *
     * @params{array} the data to convert
     *
     **/
    this.convertData = function(data) {
        if (data.length >= 4) {
            var pos = data[0]; //FIXME - should be indexed collection
            var row = data[1];
            var col = data[2];
            var val = data[3];

            var index = row;
            //var time = col + " * 16n";
            var time = pos + " + (" + col + " * 16n)";
            console.log("Time is " + time);
            if (val == 1) {
                note = this.scale[row] + this.octave;
            } else {
                note = null;
            }
            var converteddata = [time, note];
            return converteddata;
        }
    }

    /**
     * Send converted data to a part.
     *
     * @params {array} - converted data
     *
     **/
    this.sendConvertedDataToPart = function(data) {
        var time = data[0];
        var note = data[1];
        //this.part.setNoteArray(index, time, note);
        this.part.tonepart.at(time, note);
    }

    /** 
     * Queries associated part for note data for a particular bar,
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

    /* 
     *
     * So this should know what a simple bar sequencer needs for its display; it's
     * the adaptor. It knows the scale and associated notes that will be sent to
     * the part once the bar sequencer data (row and column) comes in. Again, it's
     * the adaptor; that's the idea. So, if there's a scale[0] at the 4th 16th
     * note, it will send back bararray[0][3] = 1;
     *
     * A bararray is an array of linearrays (where each linearray represents the
     * row for a particular note)
     *
     *
     */

    this.getBarArray = function(bar, division){
        bararray = new Array();
        for (i = 0; i < this.scale.length; i++) {
            bararray[i] = new Array();
            for (j = 0; j < division; j++) {
                bararray[i][j] = 0;
            }

        }
        var note;
        var time;

        for (i=0; i < division; i++){
            time = bar + "m" + " + (" + i + " * " + division + "n)";
            note = this.part.tonepart.at(time);
            if (note != null) {
                notestoprocess = [];
                if (Array.isArray(note.value)) {
                    notestoprocess = note.value;
                } else {
                    notestoprocess.push(note.value);
                }
                for (j = 0; j < notestoprocess.length; j++) {
                    // row value will be determined by place in scale - so index of scale array
                    var octavestripped = notestoprocess[j].slice(0, -1);
                    var row = this.scale.indexOf(octavestripped); // strip off octave 
                    bararray[row][i] = 1;
                }

            }

        }
        return bararray;
    }
}
