
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

    var note = ["C2", "D2", "E2", "F2", "G2", "A2", "B2"];

    // Interface ////////////////////////////////////////////


    var a = new Interface.Panel({ 
        container:document.querySelector("#InterfacePanel") 
    });

    var mb = new Interface.MultiButton({
        rows: 7, 
        columns: 1,
        mode: 'contact',  // has no effect
        bounds:[.05, .05, .5, .8],
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

    var v = new Interface.Slider({
        target: pluckbass,
        key: 'volume',
        min: -36,
        max: 6,
        label: 'Vol',
        bounds: [0.65, 0.05, 0.25, 0.25],
        onvaluechange : function() {
            pluckbass.volume.value = this.value;
            // console.log("this.value " + this.value);
        }
    });

    a.add(mb, v);



}

