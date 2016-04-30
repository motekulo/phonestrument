
function bass() {
    console.log("Starting bass");
    // Following a musical practice, a workflow, thus:
    //
    // - Select a bass
    // - Adjust the sound
    // - Start playing
    // - Adjust tempo
    // - Play and record (when ready)
    //

    var pluckbass = new Tone.PluckSynth().toMaster();
    pluckbass.triggerAttack("E3");

    // Defaults:
    // attackNoise:1
    // dampening:4000
    // resonance:0.9

    //var note = ["C2", "D2", "E2", "F2", "G2", "A2", "B2"];
    var note = [26, 28, 30, 31, 33, 35, 37];

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
            if (note[0] < 96) {
                for (i=0; i < note.length; i++){
                    note[i] = note[i] + 12;
                }

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
            if (note[0] > 12) {
                for (i=0; i < note.length; i++){
                    note[i] = note[i] - 12;
                }

            }
        }

    });

    var mb = new Interface.MultiButton({
        rows: 7, 
        columns: 1,
        mode: 'contact',  // has no effect
        bounds:[.2, .05, .45, .8],
        onvaluechange : function(row, col, value) {
            console.log( 'row : ' + row + ' , col : ' + col + ' , value : ' + value);
            timestring = "0:0:" + col;
            console.log("timestring: " + timestring);
            if (value == 1) {
                //note[row][col].start(timestring);
                pluckbass.triggerAttack(note[6 - row]);
            } else {
                //note[row][col].stop();
            }
        },
    });

    var vs = new Interface.Slider({
        target: pluckbass,
        key: 'volume',
        min: -36,
        max: 6,
        label: 'Vol',
        bounds: [0.7, 0.05, 0.1, 0.25],
        onvaluechange : function() {
            pluckbass.volume.value = this.value;
            // console.log("this.value " + this.value);
        }
    });

    var as = new Interface.Slider({
        target: pluckbass,
        key: 'attackNoise',
        min: 0,
        max: 1,
        label: 'Attack',
        bounds: [0.85, 0.05, 0.1, 0.25],
        onvaluechange : function() {
            pluckbass.attackNoise.value = this.value;
            // console.log("this.value " + this.value);
        }
    });

    var ds = new Interface.Slider({
        target: pluckbass,
        key: 'dampening',
        min: 0,
        max: 5000,
        label: 'Dampening',
        bounds: [0.7, 0.35, 0.1, 0.25],
        onvaluechange : function() {
            pluckbass.dampening.value = this.value;
            // console.log("this.value " + this.value);
        }
    });

    var rs = new Interface.Slider({
        target: pluckbass,
        key: 'resonance',
        min: 0,
        max: 1,
        label: 'Resonance',
        bounds: [0.85, 0.35, 0.1, 0.25],
        onvaluechange : function() {
            pluckbass.resonance.value = this.value;
            // console.log("this.value " + this.value);
        }
    });



    a.add(ub, db, mb, vs, as, ds, rs);



}

