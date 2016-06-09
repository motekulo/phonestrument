var phonestrument = new Phonestrument(116, 4, "E", 2);
var currentBar = "";
phonestrument.schedulePing(function(pos){
    console.log(pos);
    currentBar = pos;
    seqMatrix.matrix[1][4] = 1;
    seqMatrix.matrix[4][1] = 1;
    seqMatrix.draw();
}, "1m");

nx.onload = function(){
    console.log("nexusUI loaded from phonestrument");
    nx.colorize("#00CCFF"); // sets accent (default)
    nx.colorize("border", "#222222");
    nx.colorize("fill", "#222222");
    playButton.mode = "toggle";
    addItemButton.mode = "toggle";
//    rewindButton1.getOffset();

    addItemButton.on('*', function(data) {
        if (data.press == 1) {
            mainStage.addItem();
            //phonestrument.beepToTest();
            //
            phonestrument.createNewPlayer();
            
        }
    })

    mainStage.on('*', function(data) {
        console.log(data);
    })

    seqMatrix.row = 7;
    seqMatrix.col = 16;
    seqMatrix.init();
    seqMatrix.draw();

    seqMatrix.on('*', function(data) {
        console.log(data);
        
        phonestrument.currentPlayer.updatePart(currentBar, data);

    })
    var playing = false;
    playButton.on('press', function(data) {
        //console.log(data);
        if (data == 1){
            if (!playing) {
                console.log("Starting transport");
                phonestrument.startPlaying();
                playing = true;
            } else if (playing) {
                console.log("Stopping transport");
                phonestrument.stopPlaying();
                playing = false;
            }
        }
    })

}

