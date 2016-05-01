
function monosynth() {
    console.log("Starting bass");
    // Following a musical practice, a workflow, thus:
    //
    // - Select a bass
    // - Adjust the sound
    // - Start playing
    // - Adjust tempo
    // - Play and record (when ready)
    //

    var mono = new Tone.MonoSynth().toMaster();
    mono.triggerAttackRelease("E3", "4n");

    // Defaults:
    // attackNoise:1
    // dampening:4000
    // resonance:0.9

    var notename = ["C", "D", "E", "F", "G", "A", "B"];
    var octave = 4;

    // Interface ////////////////////////////////////////////

    var a = new Interface.Panel({ 
        container:document.querySelector("#InterfacePanel") 
    });

    var ub = new Interface.ButtonV({
        bounds: [.05, .1, .1, .1],
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
        bounds: [.05, .7, .1, .1],
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
        bounds:[.2, .05, .25, .8],
        onvaluechange : function(row, col, value) {
            console.log( 'row : ' + row + ' , col : ' + col + ' , value : ' + value);
            timestring = "0:0:" + col;
            console.log("timestring: " + timestring);
            if (value == 1) {
                //note[row][col].start(timestring);
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
        mode: 'toggle',
        bounds:[.5, .05, .15, .1]

    });

    var k1 = new Interface.Knob({ 
        bounds:[.5, .15, .15, .15],
        value:.25,
        usesRotation:true,
        centerZero: false,
    });

    var ems = new Interface.MultiSlider({
        count:4,
        min: 0,
        max: 1,
        label: 'ADSR',
        bounds: [0.7, 0.05, 0.25, 0.25],
        onvaluechange : function() {
            // console.log("this.value " + this.value);
        }
    });

    var fk2 = new Interface.Knob({ 
        bounds:[.5, .5, .15, .15],
        value:.25,
        usesRotation:true,
        centerZero: false,
    });

    var efms = new Interface.MultiSlider({
        count:4,
        min: 0,
        max: 1,
        label: 'ADSR',
        bounds: [0.7, 0.5, 0.25, 0.25],
        onvaluechange : function() {
            // console.log("this.value " + this.value);
        }
    });


    a.add(ub, db, mb, ob, k1, ems, fk2, efms);



}

