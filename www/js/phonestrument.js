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
    var synth = new Tone.MonoSynth().toMaster();
    synth.triggerAttackRelease("C4", "8n");
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

    var mp = new Interface.Panel({ 
        container:document.querySelector("#InterfacePanel") // FIXME - should be passed in to constructor
    });

    var home = new Interface.Button({
        bounds: [0, 0, .2, .1],
        label: "Home",
        mode: 'momentary',
        ontouchend : function() {
            goHome();
        },
        onmouseup : function() {
            goHome();
        }
    });

    var goHome = function() {
        mp.clear();
        //        mp.add(home, ib1, ib2, tb, lb, tfl_bar, pb, pbl, dconnect);
        drawHomePage();
        barseq.setForeground(false); // stop sequencer from redrawing its view
    }


    var ib1 = new Interface.Button({
        bounds: [.25, 0, .2, .1],
        label: "Monosynth",
        mode: 'momentary',
        ontouchend : function() {
            showMonoSynth();
        },
        onmouseup : function() {
            showMonoSynth();
        } 

    });

    var showMonoSynth = function(){  // synth
        mp.remove(ib1);
        mp.remove(ib2);
        //mp.remove(tb);
        mp.remove(pb);
        mp.remove(pbl);
        mp.remove(dconnect);
        //monosynth.draw(mp);
        samplesynth.draw(mp);
        barseq.setForeground(false); // stop sequencer from redrawing its view
    }

    var ib2 = new Interface.Button({
        bounds: [.5, 0, .2, .1],
        label: "Bar seq",
        mode: 'momentary',
        ontouchend : function() {
            showBarSeq();
        }, 
        onmouseup : function() {
            showBarSeq();
        } 

    });

    var showBarSeq = function() {
        mp.remove(ib1);
        mp.remove(ib2);
        //mp.remove(tb);
        mp.remove(pb);
        mp.remove(pbl);
        mp.remove(dconnect);
        //barseq.setForeground(true); // stop sequencer from redrawing its view
        sampleseq.setForeground(true); // stop sequencer from redrawing its view
        //barseq.draw(mp);
        sampleseq.draw(mp);
    }

    var tb = new Interface.ButtonV({    // Transport play button
        bounds: [.05, .15, .05, .1],
        points: [{x:0,y:0},{x:1,y:.5},{x:0,y:1}],
        mode: 'toggle', 
        textLocation: {x:.5,y:.5},
        onvaluechange : function (){
            if (this.value == 1) {
                console.log("Transport start");
                Tone.Transport.start();
            } else {
                console.log("Transport stop");
                Tone.Transport.stop();
            }
        }
    });

    var lb = new Interface.ButtonV({   // Loop button
        bounds: [.15, .15, .05, .1],
        points: [{x:0,y:.5},{x:.35,y:.85},{x:.65,y:.85},{x:1,y:.5},{x:.65,y:.15},{x:.5,y:.15},{x:.5,y:.05},{x:.3,y:.25},{x:.5,y:.5},{x:.5,y:.4},{x:.65,y:.4},{x:.75,y:.5},{x:.65,y:.6},{x:.35,y:.6},{x:.25,y:.5},{x:.35,y:.4},{x:.2,y:.25},{x:0,y:.5}],
        mode: 'toggle', 
        textLocation: {x:.5,y:.5},
        onvaluechange : function (){
            if (this.value == 1) {
                console.log("Loop start");
                Tone.Transport.loopStart = currentpos;
                var end = currentpos + " + 1m";
                console.log("loopend is " + end);
                Tone.Transport.loopEnd = end;
            } else {
                console.log("Loop stop");
                Tone.Transport.loopStart = 0;
                Tone.Transport.loopEnd = "4m";
            }
        }
    });

    var tfl_bar = new Interface.Label({ 
        bounds:[.25,.15, .1, .1],
        size: 24,
        style: 'bold',
        hAlign:"left",
        value: "0"
    });

    var pb = new Interface.Patchbay({ 
        bounds:[0, .35, 1, .5],
        points:[ 
        {name:'syn-in'},{name:'syn-out'},
        {name:'seq-in'},{name:'seq-out'},
        {name:'pt1-in'},{name:'pt1-out'}, 
        {name:'main', name2:'in' }],
        onconnection: function( start, end ) {
            pbl.setValue( start.name + ' connected to ' + end.name );
            console.log("Connection made " + start.name + 
                    " " + start.name2 + " to " + end.name + 
                    " " + end.name2);

            if ((start.name == "syn-out") && (end.name == "main")) {
                //monosynth.connectSynth();
                samplesynth.connectSynth();
            };

            if ((start.name == "pt1-out") && (end.name == "syn-in")) {
                console.log("going to connect pt1 synth to syn-in");
               // part.setSynthOut(monosynth.getSynth());
                //part.setSynthOut(samplesynth.getSynth());
                part.setSynthOut(samplesynth);
            };

            if ((start.name == "seq-out") && (end.name == "pt1-in")) {
                console.log("connecting seq out to pt1 in");
                // we are connecting an adaptor between the sequence and part
                adaptor.connectToPart(part);
                sampleseq.setAdaptor(adaptor);
                //barseq.setAdaptor(adaptor);
                //barseq.initExternalPart(part);
                barseq.isConnected = true;
            };


            if ((start.name == "seq-out") && (end.name == "syn-in")) {
                console.log("connect seq out to syn in (not doing anything)");
                //barseq.setSynthOut(monosynth.getSynth);
                //barseq.initPart();
            };

        },
        ondisconnection: function( start, end ) {
            pbl.setValue( start.name + ' disconnected from ' + end.name );
            console.log("Connection made");
            if ((start.name == "syn-out") && (end.name == "main")) {
                //monosynth.disconnectSynth();
            };


        }
    }); 

    var pbl = new Interface.Label({
        bounds:[.05, .75, 1, .05],
        vAlign:'middle',
        value:'Drag a cable between patch points',
    })

    var dconnect = new Interface.Button({
        bounds: [0, .9, .1, .1],
        label: "Disconnect",
        mode: 'momentary',
        ontouchend : function() {
            for (i=0; i < pb.connections.length; i++) {
                console.log("connection " + pb.connections[i]);
                pb.deleteConnection(pb.connections[i]);
            }
        }
    });

    drawHomePage();

    function drawHomePage() {
        mp.add(home, ib1, ib2, tb, lb, tfl_bar, pb, pbl, dconnect);
    };

}
