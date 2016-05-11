function Phonestrument(){

    var monosynth = new Basicmonosynth();
    var barseq = new BarSequencer();
    var part = new Part();
    var adaptor = null;

    //barseq.initExternalPart(part);
    //part.setSynthOut(monosynth.getSynth());

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
            //barseq.connectsynth(monosynth.getsynth());
            //barseq.initInternalPart();
            //barseq.setSynthOut(monosynth.getSynth());
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
                //barseq.setSynthOut(monosynth.getSynth);
                //barseq.initPart();
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

    mp.add(home, ib1, ib2, tb, pb, pbl, dconnect);

}
