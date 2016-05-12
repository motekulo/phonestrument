function Part() {
    var synth; 

    this.voices = [];

    this.setSynthOut = function(extsynth){
        synth = extsynth;
    }

    this.setNoteArray = function(voiceindex, time, pitch) {
        this.voices[voiceindex].at(time, pitch);
    }

    this.addVoice = function() {
        var notes = [];
        var voice = new Tone.Part(function(time,note){
            synth.triggerAttackRelease(note,"16n", time);
        }, notes);
        this.voices.push(voice);
        voice.loop = false;
        voice.start(0.5);
    };
}

