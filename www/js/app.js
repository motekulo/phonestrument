var phonestrument = new Phonestrument(116, 4, "E", 2);
var currentBar = "";
phonestrument.schedulePing(function(pos){

    var partState = phonestrument.currentPlayer.part.state;
    var partProgress = phonestrument.currentPlayer.part.progress;
    console.log(pos + "  and part is " + partState + " and progress " + partProgress);
    currentBar = pos;
    var bar = currentBar.split(':')[0];
    var barMatrix = phonestrument.currentPlayer.getCurrentBarDataToDisplay(bar, 16);
    seqMatrix.matrix = barMatrix;
    //seqMatrix.matrix[4][1] = 1;
    seqMatrix.draw();
}, "1m");

        $(document).ready(function() {
            $('#instWaveSelect').change(function() {
                var waveType = ( $(this).find(":selected").val() );
                phonestrument.currentPlayer.instrument.set({
                        "oscillator" : {
                            "type" : waveType
                        }
                    });
                
            });
        });

nx.onload = function(){
    console.log("nexusUI loaded from phonestrument");
    nx.colorize("#00CCFF"); // sets accent (default)
    nx.colorize("border", "#222222");
    nx.colorize("fill", "#222222");
    playButton.mode = "toggle";
    addItemButton.mode = "toggle";
//    rewindButton1.getOffset();

    tempoText.set({
        value: 116
    })
    tempoText.min = 1;
    tempoText.max = 360;
    tempoText.decimalPlaces = 0;
    
    tempoText.on('*', function(data){
        //console.log(data);
        phonestrument.changeTempo(data.value);
    })
    
    addItemButton.on('*', function(data) {
        if (data.press == 1) {
            mainStage.addItem();
            
            phonestrument.createNewPlayer();
         
        }
    })
    
    
    mainStage.on('*', function(data) {
       //console.log(data.x);
        
        phonestrument.currentPlayer.panVol.pan.value = data.x;
        if (data.state == "release"){
            phonestrument.currentPlayer = phonestrument.player[data.item];
            if (data.onstage && phonestrument.currentPlayer.part.state == "stopped") {
                var nextBar = currentBar + " + 1m";
                console.log("starting part at " + nextBar);               
                phonestrument.currentPlayer.part.start("0:0:0"); // doesn't work as expected; starts immediately
                 
            } else if (!data.onstage && phonestrument.currentPlayer.part.state == "started") {
                var nextBar = currentBar + " + 1m";
                console.log("stopping part at " + nextBar);               
                phonestrument.currentPlayer.part.stop("0:0:0"); // doesn't work as expected; stops immediately
                
            }
        }
    })

    seqMatrix.row = 7;
    seqMatrix.col = 16;
    seqMatrix.init();
    seqMatrix.draw();

    seqMatrix.on('*', function(data) {
        //console.log(data);
        
        phonestrument.currentPlayer.updatePart(currentBar, data);

    })
    var playing = false;
    playButton.on('press', function(data) {
        //console.log(data);
        if (data == 1){
            if (!playing) {
                //console.log("Starting transport");
                phonestrument.startPlaying();
                playing = true;
            } else if (playing) {
               // console.log("Stopping transport");
                phonestrument.stopPlaying();
                playing = false;
            }
        }
    })

}

