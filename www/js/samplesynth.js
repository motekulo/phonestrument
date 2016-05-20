
function Samplesynth() {
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


    /*
       var msampler = new Tone.Sampler({
       A : {
       1 : "./samples/chh_mixed_1.wav",
       2 : "./samples/kick_mix_1.wav",
       3 : "./samples/ohh_mixed_1.wav",
       4 : "./samples/snare_mix_1.wav"
       }
       }).toMaster();

    //var sampler = new Tone.PolySynth(4, msampler);//.toMaster();
    var sampler = new Tone.PolySynth(4, Tone.Sampler);//.toMaster();

    var murls = ["./samples/chh_mixed_1.wav", "./samples/kick_mix_1.wav", "./samples/ohh_mixed_1.wav", "./samples/snare_mix_1.wav"];

    //    sampler._loadBuffers(murls);

    Tone.Buffer.onload = function(){
    sampler.triggerAttack("A.1")
    }
    */   
    var samplenames = ["A.1", "A.2", "A.3", "A.4"];

    var kicksampler = new Tone.Sampler({
        A : {
            1 : "./samples/kick_mix_1.wav"
        }
    }).toMaster();

    var snaresampler = new Tone.Sampler({
        A : {
            1 : "./samples/snare_mix_1.wav"
        }
    }).toMaster();

    var ohhsampler = new Tone.Sampler({
        A : {
            1 : "./samples/ohh_mixed_1.wav"
        }
    }).toMaster();

    var chhsampler = new Tone.Sampler({
        A : {
            1 : "./samples/chh_mixed_1.wav"
        }
    }).toMaster();




    this.triggerDrum = function(samplename) {
        console.log("Triggering " + samplename);
        for (i = 0; i < samplename.length; i++) {
            switch(samplename[i]) {
                case "A.1":
                    kicksampler.triggerAttack("A.1");
                    break;

                case "A.2":
                    snaresampler.triggerAttack("A.1");
                    break;

                case "A.3":
                    ohhsampler.triggerAttack("A.1");
                    break;

                case "A.4":
                    chhsampler.triggerAttack("A.1");
                    break;


            }
        }
    }
    //    var octave = 4;

    this.draw = function(panel){
        //panel.clear();
        panel.add(mb, ob, ems, efms);
    };

    this.disconnectSynth = function(){
        sampler.disconnect();
    }

    this.connectSynth = function(){
        sampler.connect(Tone.Master);
    }

    this.getSynth = function(){
        return sampler;
    }
    // Interface ////////////////////////////////////////////

    var mb = new Interface.MultiButton({
        rows: 4, 
        columns: 1,
        mode: 'contact',  
        bounds:[.2, .35, .25, .6],
        onvaluechange : function(row, col, value) {
            console.log( 'row : ' + row + ' , col : ' + col + ' , value : ' + value);
            timestring = "0:0:" + col;
            console.log("timestring: " + timestring);
            if (value == 1) {
                note = samplenames[4-row];
                console.log(note);
                sampler.triggerAttackRelease(note);
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


}

