
function Barsequencer() {


    var pitches =  ["C4","D4","E4","F4"];
    var timestring = "";
    var line = new Array(4);
    //var row = new Array(16);
    //var dist = new Tone.Distortion().toMaster();
    //var synth = new Tone.MonoSynth().toMaster();
    var synth;
   
    //synth.triggerAttackRelease("C4", "16n");
//    var part = Object.create(Part);

    var part = new Part();
//    part.setSynth();
    part.connectSynthToMainOut();

    this.connectsynth = function(extsynth){

       // synth = new Tone.PolySynth(4, extsynth).toMaster();
       synth = extsynth;
    }

    this.draw = function(panel){
        panel.add(b, multiButton);
    };
    
    //    for (i = 0; i < 4; i++){
    //synth[i] = new Tone.DrumSynth().toMaster();
    //   }
    //var seq = new Tone.Sequence(callback, ["C3", "Eb3", "F4", "Bb4"], "8n");

    for (j = 0; j < 4; j++) {
        //note[j] = [,,,,,,,,,,,,,,,];

        var initialArray = new Array(16);
        for (i = 0; i < 16; i++) {
            beatstring = i + " * 16n";
            initialArray[i] = [beatstring, null];
        }

       // line[j] = new Tone.Part(function(time, note){
       //     console.log("Triggered");
       //     synth.triggerAttackRelease(note, "16n", time);
       // }, initialArray);

        line[j] = part.addVoice();

        line[j].loop = true;
        line[j].start(1);
    }

    // Interface section //////////////////////////////////////////////////////
    var b = new Interface.Button({ 
        bounds:[.05,.05,.1,.1],  
        label:'On/Off',
        onvaluechange : function() {
            console.log("Value: " + this.value)
                if (this.value == 1) {
                    Tone.Transport.start();
                } else {
                    Tone.Transport.stop();
                }
        }
    });

    var multiButton = new Interface.MultiButton({
        rows:4, columns:16,
        bounds:[.2,.05,.6,.8],
        onvaluechange : function(row, col, value) {
            console.log( 'row : ' + row + ' , col : ' + col + ' , value : ' + value);
            timestring = "0:0:" + col;
            beatstring = col + " * " + "16n";
            console.log("beatstring: " + beatstring);
            if (value == 1) {
                //line[0].at(beatstring, pitches[0]); 
                line[row].at(beatstring, pitches[row]); 
                // note[row][col].start(timestring);
            } else {
                //line[row].at(beatstring, null); 
                line[row].at(beatstring, null); 
                // note[row][col].stop();
            }
        }
    });
}





