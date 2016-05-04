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

document.addEventListener("deviceready", function(event) {

    try {
        mcontext = Tone.context;
        console.log("Loaded");
    } catch (e) {
        alert('No web audio support in this browser!');
    }

    //var main = new Mainscreen();
    //main.draw();

    var monosynth = new Basicmonosynth();
    var barseq = new Barsequencer();

    var mp = new Interface.Panel({ 
        container:document.querySelector("#InterfacePanel") 
    });

    console.log("Mainscreen...");

    var home = new Interface.Button({
        bounds: [0, 0, .2, .1],
        label: "Home",
        mode: 'momentary',
        onmouseup : function() {
            //    console.log("Mouse up over home");
            //            mono.disconnectsynth();
            mp.clear();
            mp.add(home, ib1, ib2, pb, pbl, dconnect);
        }
    });

    var ib1 = new Interface.Button({
        bounds: [.25, 0, .2, .1],
        label: "Monosynth",
        mode: 'momentary',
        onmouseup : function() {
            mp.remove(ib1);
            mp.remove(ib2);
            mp.remove(pb);
            mp.remove(pbl);
            mp.remove(dconnect);
            monosynth.connectsynth();
            monosynth.draw(mp);
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
            mp.remove(pb);
            mp.remove(pbl);
            mp.remove(dconnect);
            barseq.connectsynth(monosynth.getsynth());
            barseq.draw(mp);
        } 

    });

    var pb = new Interface.Patchbay({ 
        bounds:[0, .2, 1, .6],
        points:[ 
        {name:'synth', name2:'out'},
        {name:'seq', name2:'in'},{name:'seq', name2:'out'},
        {name:'pt1-in'},{name:'pt1-out'}, 
        {name:'main', name2:'in' }],
        onconnection: function( start, end ) {
            pbl.setValue( start.name + ' connected to ' + end.name );
            console.log("Connection made " + start.name + 
                    " " + start.name2 + " to " + end.name + 
                    " " + end.name2);

            if ((start.name == "pt1-out") && (end.name == "main")) {
                console.log("going to connect pt1 synth to out");
            }

        },
        ondisconnection: function( start, end ) {
            pbl.setValue( start.name + ' disconnected from ' + end.name );
            console.log("Connection made");
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

    mp.add(home, ib1, ib2, pb, pbl, dconnect);

});




