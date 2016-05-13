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
 * A bar sequencer is a view in the form of rows of buttons. Each row
 * represents a pitch, and each column an even subdivision in the bar. 
 *
 **/
function BarSequencer() {

    var currentposition = 0;
    var subdivision = 16;
    var pitches =  ["C4","D4","E4","F4"];
    var timestring = "";
    var line = new Array(4);
    var synth;
    var adaptor = null;
    var isConnected = false;
    var foreground = false;

    this.setForeground = function(inforeground) {
        foreground = inforeground;
    }

    /** 
     * Sets current bar position, then queries adaptor for note
     * information and updates display accordingly.
     *
     * @param {string} current Tone.js position string 
     *
     * @returns (array) 2d array of voice, note info (1 for on, 0 for
     * off)
     *
     **/
    this.setCurrentBarNum = function(position){
        currentposition = position;
        console.log("barseq position " + currentposition);
        var bar = currentposition.split(':')[0];
        var bararray = adaptor.getBarArray(bar, subdivision);

        for (j = 0; j < bararray.length; j++){
            var voicearray = bararray[j];
            for (i = 0; i < voicearray.length; i++) {
                multiButton._values[(j * 16 + i)] = voicearray[i];
            }

        }

        if (foreground) {
            multiButton.refresh();
        }
        return bararray; // for test purposes only really

    }

    /**
     * Connects an adaptor 
     *
     * @params {adaptor} - adaptor to connect to
     *
     **/
    this.setAdaptor = function(extadaptor){
        adaptor = extadaptor;
    }

    /**
     *
     * Connects a synth directly. It makes it possible to have a bar sequencer
     * not connected to a part, but just outputting sound directly to a synth.
     * Not very useful?
     *
     * @params {extsynth} - the synth to connect to
     *
     **/
    this.setSynthOut = function(extsynth){
        synth = extsynth;
    }

    /**
     * Draws the view
     *
     * @params {panel} - the Interface.Panel to draw widgets to
     *
     **/
    this.draw = function(panel){
        panel.add(b, multiButton);
    };

    /**
     *
     * Initialize the part that the sequencer will write to
     *
     * @params {extpart} - the part the sequencer writes to and reads from
     *
     **/
    this.initExternalPart = function(extpart){
        part = extpart; 
        isConnected = true;
        for (j = 0; j < 4; j++) {
            part.addVoice();
        }
    }

    /**
     * Disconnect from the associated part
     *
     **/
    this.disconnectFromPart = function(){
        isConnected = false;
    }

    //
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
            if (isConnected) {
                //part.setNoteArray(row, col, value);
                var datatoconvert = [currentposition, row, col, value];
                var converteddata = adaptor.convertData(datatoconvert);
                adaptor.sendConvertedDataToPart(converteddata);
            }
        }
    });
}





