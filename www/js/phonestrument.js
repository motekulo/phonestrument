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
 * A Phonestrument is the main controller for the application. It draws the
 * main (home) screen, and controls how components are connected together. Most
 * of the action takes place in the callbacks from the Interface widgets.
 *
 **/
function Phonestrument(){

    var monosynth = new Basicmonosynth();
    var samplesynth = new Samplesynth();
    var barseq = new BarSequencer();
    var sampleseq = new SampleSequencer();
    var part = new Part();
    // var adaptor = new SimpleBarSequencerAdaptor();
    var adaptor = new SampleSequencerAdaptor();
    var currentbarnum = 0;
    var currentpos = 0;
    //    var synth = new Tone.MonoSynth().toMaster();
    //    synth.triggerAttackRelease("C4", "8n");
    /**
     * Schedule a regular start of bar notification to a bar sequencer, so that
     * it can draw itself
     *
     **/
    Tone.Transport.scheduleRepeat(function(time){
        //console.log("Bar: " + currentbarnum);
        currentpos = Tone.Transport.position;
        console.log("Bar: " + currentpos);
        //barseq.setCurrentBarNum(currentpos);
        sampleseq.setCurrentBarNum(currentpos);
        currentbarnum++;
        tfl_bar.setValue(currentpos);
    }, "1m");

    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = "4m";
    Tone.Transport.bpm.value = 60;

    var paneldiv = document.querySelector("#InterfacePanel");

    /* Interface section - experimenting with nexusUI
     *
     */

    drawHomePage();

    function drawHomePage() {

    };

}

nx.onload = function(){
    console.log("nexusUI loaded from phonestrument");
//    seqmatrix.row = 4;
//    seqmatrix.col = 16;
//    seqmatrix.init();
//    seqmatrix.draw();
//    multi1.erase();
//    var tohide = document.querySelector("#multi1");
//   tohide.style.display="none";
/*
    changebutton.on('*', function(data){
        console.log("Press: " + data.press + " X: " + data.x + " Y: " + data.y);
        if (data.press == 1) {
            //seqmatrix.erase();
            //nx.add("multislider");
            //window.location.href='page2.html';
            var canvastotransform = document.querySelector("#seqmatrix");
            nx.transform(canvastotransform, "multislider"); 
            //$("#seqmatrix").remove();
            //$("#nexusgui").append("<canvas nx=\"button\" id=\"testbutton\"></canvas>");
            //testbutton.init();
            //testbutton.draw();
            var parentDiv = document.querySelector("#tochange");
            var newChild = document.querySelector("#multi1");
            var oldChild = document.querySelector("#seqmatrix");
            //$("#multi1").height("100%");
            newChild.style.display="block";
            oldChild.style.display="none";

//            parentDiv.replaceChild(newChild, oldChild);
        };
    })

    changebackbutton.on('press', function(data) {
        if (data == 1) {
            var oldChild = document.querySelector("#multi1");
            var newChild = document.querySelector("#seqmatrix");
            //$("#multi1").height("100%");
            newChild.style.display="block";
            oldChild.style.display="none";

          console.log("Changing back");
        }
    })

*/

}


