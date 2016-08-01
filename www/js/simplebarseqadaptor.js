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
    this.notesinscale = 4; //FIXME Redundant?
    this.scalestructure = [2,2,1,2,2,2,1];
    this.key = "C";
    this.scale = this.setScale(this.key);
    this.octave = 4; // fudge for now

    // initialize arrays to represent the sequencer view at various
    // divisions (from 2 to 16 are actually used)
    var bars = 4;
    this.sequencerViewData = new Array(17); // need to refer to a division of 16
    for (i=0; i < 17; i++) {    //bar division (basically serves as an index to the correct division view)
        var bar = new Array(bars);
        for (b=0; b < bars; b++) {
           var matrix = new Array(i);
           for (j=0; j < i; j++) {  // barmatric.matrix is weird - has columns, rows; this is columns
               var matrixcolumn = new Array();
               for (k=0; k < 7; k++) {  //k is number of rows in array; again due to nexusUI matrix oddness
                   matrixcolumn[k] = 0;
               }
               matrix[j] = matrixcolumn;
           }
           bar[b] = matrix
        }
        this.sequencerViewData[i] = bar;
    }

    /* That holds a single bar of data for each division; we need x bars of data
     * for each division...
     * So division[div][bar][row][col];
     * Actually sequencerViewData[div][bar][coumn][row]
     *
    */

}

SimpleBarSequencerAdaptor.prototype.adjustViewArray = function(adj) {

    if (adj < 0) {
        for (i=0; i < 17; i++) {   // go through all bar divisions
            for (j = 0; j < Math.abs(adj); j++) {
                this.sequencerViewData[i].pop();
            }
        }
    } else {
        for (j = 0; j < adj; j++) {
            this.sequencerViewData.push();
        }
    }

}

SimpleBarSequencerAdaptor.prototype.setScale = function(key){
    var pitch = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
    var scale = [];
    var start = pitch.indexOf(key);
    scale.push(pitch[start]);
    var prevnoteindex = start;
    for (i = 0; i < this.scalestructure.length - 1; i++) {
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


/**
* Connects to the part that it needs to write to and extract
* information from.
*
* @params {Part} the part to connect to
*
**/
//    SimpleBarSequencerAdaptor.prototype.connectToPart = function(part) {
//        this.part = part;
//
//    }

/**
*
* Convert data from a form output by the sequencer, to a form usable by a
* Part.  From a simple bar sequencer we get position (transport), rows
* (an array), column, value data. A part expects a voice index (row, in
* this case), time, and pitch
*
* @params{array} the data to convert
*
**/

SimpleBarSequencerAdaptor.prototype.convertData = function(pos, data, division) {

    var row = data.row;
    var col = data.col;
    var val = data.level;
    var note = "";

    //var index = row;
    var time = pos + " + (" + col + " * " + division + "n)";

    //console.log("Time is " + time);

    note = this.scale[row] + this.octave;

    //var converteddata = [time, note];

    var converteddata = {
        "time": time,
        "note": note
    };

    return converteddata;
}



/**
* Send converted data to a part.
*
* @params {array} - converted data
*
**/
/*SimpleBarSequencerAdaptor.prototype.sendConvertedDataToPart = function(data) {
var time = data[0];
var notes = data[1];
//this.part.setNoteArray(index, time, note);
this.part.tonepart.at(time, notes);
} */

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

SimpleBarSequencerAdaptor.prototype.getBarArray = function(bar, division){

    return this.sequencerViewData[division][bar];
}


SimpleBarSequencerAdaptor.prototype.updateViewData = function (bar, division, data) {

    this.sequencerViewData[division][bar] = data;

};
