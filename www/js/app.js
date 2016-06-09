var phonestrument = new Phonestrument(116, 4, "E", 2);

phonestrument.schedulePing(function(){
    console.log("Ping");
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

    seqMatrix.row = 4;
    seqMatrix.col = 12;
    seqMatrix.init();
    seqMatrix.draw();

    seqMatrix.on('*', function(data) {
        console.log(data);
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

