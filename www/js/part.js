
function Part() {
    var voices = [];
    var notes = new Array(16);
    var pitches =  ["C4","D4","E4","F4"];
    var synth; 
    var beatstring = "";

    this.setSynth = function() {
        console.log("Setting synth");
    };

    this.setSynthOut = function(extsynth){
        synth = extsynth;
    }

    this.connectSynthToMainOut = function() {
        synth.connect(Tone.Master);
    };

    this.setNoteArray = function(row, col, value){
        beatstring = col + " * " + "16n";
        if (value == 1) {
            voices[row].at(beatstring, pitches[row]); 
        } else {
            voices[row].at(beatstring, null); 
        }}

    this.addVoice = function() {
        for (i = 0; i < 16; i++) {
            beatstring = i + " * 16n";
            notes[i] = [beatstring, null];
        }

        var voice = new Tone.Part(function(time,note){
            synth.triggerAttackRelease(note,"16n", time);
        }, notes);
        voices.push(voice);
        voice.loop = true;
        voice.start(0.5);
    };
}

