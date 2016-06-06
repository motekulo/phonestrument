
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


    var mono = new Tone.PolySynth(4, Tone.SimpleSynth);//.toMaster();
//    var mono = new Tone.SimpleSynth;//.toMaster();
    //var mono = new Tone.MonoSynth;//.toMaster();

    var notename = ["C", "D", "E", "F", "G", "A", "B"];
    var octave = 4;
    
/*    this.draw = function(panel){
        //panel.clear();
        panel.add(ub, db, mb, ob, k1, ems, fk2, efms);
    }; */

    this.disconnectSynth = function(){
        mono.disconnect();
    }

    this.connectSynth = function(){
        mono.connect(Tone.Master);
    }

    this.getSynth = function(){
        return mono;
    }



}

