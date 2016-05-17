
function Basicmonosynth() {
    // console.log("Starting monosynth");
    // Following a musical practice, a workflow, thus:
    //
    // - Select an instrument
    // - Adjust the sound
    // - Start playing
    // - Adjust tempo
    // - Play and record (when ready)
    //

   // var mono = new Tone.MonoSynth(); //.toMaster();
    this.moct = 4;


//    var mono = new Tone.PolySynth(8, Tone.MonoSynth);//.toMaster();
    var mono = new Tone.MonoSynth;//.toMaster();

    var notename = ["C", "D", "E", "F", "G", "A", "B"];
    var octave = 4;
    
    this.draw = function(panel){
        //panel.clear();
        panel.add(ub, db, mb, ob, k1, ems, fk2, efms);
    };

    this.disconnectSynth = function(){
        mono.disconnect();
    }

    this.connectSynth = function(){
        mono.connect(Tone.Master);
    }

    this.getSynth = function(){
        return mono;
    }
    // Interface ////////////////////////////////////////////

    var ub = new Interface.ButtonV({
        bounds: [.05, .35, .1, .1],
        points: [{x:.25,y:1},{x:.75,y:1},{x:.75,y:.5},{x:1,y:.5},{x:.5,y:0},
        {x:0,y:.5},{x:.25,y:.5}],
        mode: 'contact', 
        label: '8ve',
        textLocation: {x:.5,y:.5},
        onvaluechange : function (){
            console.log("8ve up");
            if (octave < 8) {
                octave++;
            }
        }
    });

    var db = new Interface.ButtonV({
        bounds: [.05, .85, .1, .1],
        points: [{x:.25,y:0},{x:.75,y:0},{x:.75,y:.5},{x:1,y:0.5},{x:.5,y:1},
        {x:0,y:.5},{x:.25,y:.5}],
        mode: 'contact', 
        label: '8ve',
        textLocation: {x:.5,y:.5},
        onvaluechange : function (){
            console.log("8ve down");
            if (octave > 1) {
                octave--;
            }
        }
    });

    var mb = new Interface.MultiButton({
        rows: 7, 
        columns: 1,
        mode: 'contact',  
        bounds:[.2, .35, .25, .6],
        onvaluechange : function(row, col, value) {
            console.log( 'row : ' + row + ' , col : ' + col + ' , value : ' + value);
            timestring = "0:0:" + col;
            console.log("timestring: " + timestring);
            if (value == 1) {
                note = notename[6-row]+octave;
                console.log(note);
                mono.triggerAttackRelease(note, "8n");
            } else {
                //note[row][col].stop();
            }
        },
    });

    var ob = new Interface.MultiButton({
        rows: 1,
        columns: 3,
        bounds:[.5, .35, .15, .1],
        onvaluechange : function(row, col, value) {
            switch(col){
                case 0: {
                    mono.set({
                        "oscillator" : {
                            "type" : "square"
                        }
                    });

                    ob._values[0] = 1;
                    ob._values[1] = 0;
                    ob._values[2] = 0;
                    break;
                }
                case 1: {
                    mono.set({
                        "oscillator" : {
                            "type" : "sine"
                        }
                    });
                    ob._values[0] = 0;
                    ob._values[1] = 1;
                    ob._values[2] = 0;
                    break;
                }
                case 2: {
                    mono.set({
                        "oscillator" : {
                            "type" : "triangle"
                        }
                    });
                    ob._values[0] = 0;
                    ob._values[1] = 0;
                    ob._values[2] = 1;
                    break;
                }
            } 

        }
    });

    var k1 = new Interface.Knob({ // detune
        bounds:[.5, .45, .10, .10],
        value: 0,
        usesRotation:true,
        centerZero: true,
        min: -100,
        max: 100,
        onvaluechange : function() {
            mono.set({
                "oscillator" : {
                    "detune" : this.value
                }
            });
        }

    });

    var ems = new Interface.MultiSlider({  // ADSR envelope
        count:4,
        min: 0,
        max: 1,
        label: 'ADSR',
        bounds: [0.7, 0.35, 0.25, 0.25],
        onvaluechange : function(number, value) {
            console.log("number, value: " + number + ", " + value);
            switch(number) {
                case 0: {
                    mono.set({
                        "envelope" : {
                            "attack" : value
                        }
                    });

                    break;
                }
                case 1: {
                    mono.set({
                        "envelope" : {
                            "decay" : value
                        }
                    });

break;
                }
                case 2: {
                    mono.set({
                        "envelope" : {
                            "sustain" : value
                        }
                    });

                    break;
                }
                case 3: {
                    mono.set({
                        "envelope" : {
                            "release" : value
                        }
                    });

                    break;
                }

            }

        }
    });


    var fk2 = new Interface.Knob({ 
        bounds:[.5, .7, .10, .10],
        min : 20,
        max: 15000,
        value: 200,
        usesRotation:true,
        centerZero: false,
        onvaluechange : function() {
            //console.log("freq value " + this.value);
            mono.set({
                "filterEnvelope" : {
                    "baseFrequency" : this.value
                }
            });


        }
    });

    var efms = new Interface.MultiSlider({
        count:4,
        min: 0,
        max: 1,
        label: 'ADSR',
        bounds: [0.7, 0.7, 0.25, 0.25],
        onvaluechange : function(number, value) {
            console.log("number, value: " + number + ", " + value);
            switch(number) {
                case 0: {
                    mono.set({
                        "filterEnvelope" : {
                            "attack" : value
                        }
                    });

                    break;
                }
                case 1: {
                    mono.set({
                        "filterEnvelope" : {
                            "decay" : value
                        }
                    });

                    break;
                }
                case 2: {
                    mono.set({
                        "filterEnvelope" : {
                            "sustain" : value
                        }
                    });

                    break;
                }
                case 3: {
                    mono.set({
                        "filterEnvelope" : {
                            "release" : value
                        }
                    });

                    break;
                }

            }
        }
    });


    //    ems.children[0].setValue(0.005);  // Default attack
    //    ems.children[1].setValue(0.1);  // Default decay
    //    ems.children[2].setValue(0.9);  // Default sustain
    //    ems.children[3].setValue(1);  // Default release


}

