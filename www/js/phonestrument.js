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
    var barseq = new BarSequencer();
    var part = new Part();
    var adaptor = null;
    var currentbarnum = 0;
    var currentpos = 0;

    /**
     * Schedule a regular start of bar notification to a bar sequencer, so that
     * it can draw itself
     *
     **/
    Tone.Transport.scheduleRepeat(function(time){
            //console.log("Bar: " + currentbarnum);
            currentpos = Tone.Transport.position;
            console.log("Bar: " + currentpos);
            barseq.setCurrentBarNum(currentpos);
            currentbarnum++;
    }, "1m");

    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = "4m";

    var mp = new Interface.Panel({ 
        container:document.querySelector("#InterfacePanel") 
    });

    var home = new Interface.Button({
        bounds: [0, 0, .2, .1],
        label: "Home",
        mode: 'momentary',
        onmouseup : function() {
            mp.clear();
            mp.add(home, ib1, ib2, tb, pb, pbl, dconnect);
            barseq.setForeground(false); // stop sequencer from redrawing its view

        }
    });


    var ib1 = new Interface.Button({
        bounds: [.25, 0, .2, .1],
        label: "Monosynth",
        mode: 'momentary',
        onmouseup : function() {
            mp.remove(ib1);
            mp.remove(ib2);
            mp.remove(tb);
            mp.remove(pb);
            mp.remove(pbl);
            mp.remove(dconnect);
            monosynth.draw(mp);
            barseq.setForeground(false); // stop sequencer from redrawing its view
        } 

    }
    );

    var ib2 = new Interface.Button({
        bounds: [.5, 0, .2, .1],
        label: "Bar seq",
        mode: 'momentary',
        onmouseup : function() {
            mp.remove(ib1);
            mp.remove(ib2);
            mp.remove(tb);
            mp.remove(pb);
            mp.remove(pbl);
            mp.remove(dconnect);
            barseq.setForeground(true); // stop sequencer from redrawing its view
            barseq.draw(mp);
        } 

    });

    var tb = new Interface.ButtonV({
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

    var tfl_bar = new Interface.Label({ 
        bounds:[.25,.15, .1, .1],
        size: 24,
        style: 'bold',
        hAlign:"left",
        value: "0"
    });

    var pb = new Interface.Patchbay({ 
        bounds:[0, .25, 1, .5],
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
                monosynth.connectSynth();
            };

            if ((start.name == "pt1-out") && (end.name == "syn-in")) {
                console.log("going to connect pt1 synth to syn-in");
                part.setSynthOut(monosynth.getSynth());
            };

            if ((start.name == "seq-out") && (end.name == "pt1-in")) {
                console.log("connecting seq out to pt1 in");
                // we are connecting an adaptor between the sequence and part
                adaptor = new SimpleBarSequencerAdaptor();
                adaptor.connectToPart(part);
                barseq.setAdaptor(adaptor);
                barseq.initExternalPart(part);
                barseq.isConnected = true;
            };


            if ((start.name == "seq-out") && (end.name == "syn-in")) {
                console.log("connecting seq out to syn in");
                barseq.setSynthOut(monosynth.getSynth);
                barseq.initPart();
            };

        },
        ondisconnection: function( start, end ) {
            pbl.setValue( start.name + ' disconnected from ' + end.name );
            console.log("Connection made");
            if ((start.name == "syn-out") && (end.name == "main")) {
                monosynth.disconnectSynth();
            };


        }
    }); 

    var pbl = new Interface.Label({
        bounds:[.05, .75, 1, .05],
        vAlign:'middle',
        value:'Drag a cable between patch points',
    })

    var dconnect = new Interface.Button({
        bounds: [0, .8, .1, .1],
        label: "Disconnect",
        mode: 'momentary',
        onmouseup : function() {
            for (i=0; i < pb.connections.length; i++) {
                console.log("connection " + pb.connections[i]);
                pb.deleteConnection(pb.connections[i]);
            }
        }
    });

    mp.add(home, ib1, ib2, tb, tfl_bar, pb, pbl, dconnect);

}
