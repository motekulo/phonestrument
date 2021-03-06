/*
* Please see the included README.md file for license terms and conditions.
*/


// This file is a suggested starting place for your code.
// It is completely optional and not required.
// Note the reference that includes it in the index.html file.


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false app:false, dev:false, cordova:false */


// For improved debugging and maintenance of your app, it is highly
// recommended that you separate your JavaScript from your HTML files.
// Use the addEventListener() method to associate events with DOM elements.

// For example:

// var el ;
// el = document.getElementById("id_myButton") ;
// el.addEventListener("click", myEventHandler, false) ;



// The function below is an example of the best way to "start" your app.
// This example is calling the standard Cordova "hide splashscreen" function.
// You can add other code to it or add additional functions that are triggered
// by the same event or other events.

var phonestrument = new Phonestrument(116, 4, "E", 2);
var currentBar = "";  //Tone.js representation of current bar (eg "1:0:0")
var barNum = 0; // Bar number as integer
var partBar = 0; // At which point in bars the current displayed part is at
var sequencerDivision = 16;
var panOnDrag = true;
var volOnDrag = true;
var currentStagePlayerIndex = 0;
var currentStagePlayerColor = "#ffffff";

document.addEventListener('DOMContentLoaded', function () {

    console.log("App ready - app.js");
    phonestrument.schedulePing(function(pos){

        var partState = phonestrument.currentPlayer.part.state;
        var partProgress = phonestrument.currentPlayer.part.progress;
        partBar = Math.round(partProgress * phonestrument.currentPlayer.length);
        console.log(pos + "  and part is " + partState + " and progress " + partProgress);
        console.log("Bar number in current part: " + partBar);
        currentBar = pos;
        barNum = parseInt(currentBar.split(':')[0], 10);
        var barMatrix = phonestrument.currentPlayer.getCurrentBarDataToDisplay(partBar, sequencerDivision);

        seqMatrix.matrix = barMatrix;
        //seqMatrix.matrix[4][1] = 1;
        seqMatrix.draw();
        barnumberComment.val.text = pos;
        barnumberComment.draw();
    }, "1m");

    $(document).ready(function() {
        $('select').material_select();  // materialize select init
        Materialize.updateTextFields();
        $('#instWaveSelect').change(function() {
            var waveType = ( $(this).find(":selected").val() );
            phonestrument.currentPlayer.instrument.set({
                "oscillator" : {
                    "type" : waveType
                }
            });

        });

        $('#songName').change(function() {
            console.log("Name entered is " + $(this).val());
            phonestrument.name = $(this).val();
        });

        $('#instTypeSelect').change(function() {
            var instType = ( $(this).find(":selected").val() );
            console.log("Changing instrument type to " + instType);
            switch (instType) {
                case "mono":
                phonestrument.currentPlayer.setSoloInstrument();
                break;

                case "poly":
                phonestrument.currentPlayer.setChordInstrument();
                break;

                case "drums":
                phonestrument.currentPlayer.setSamplerInstrument();
                break;

                case "sampler":
                phonestrument.currentPlayer.setPitchedSamplerInstrument();
                break;
            }

        });


        $('ul.tabs').tabs({onShow: function(selectedTab){
            console.log("Tab selected " + selectedTab.selector);
            if (selectedTab.selector == "#sequencer") {
                console.log("sequencer");
                seqMatrix.getOffset();
                partLength.set({
                    value: phonestrument.currentPlayer.length
                });
                seqMatrix.col = phonestrument.currentPlayer.adaptor.currentViewDivision;
                seqMatrix.draw();
                divisionNumber.set({
                    value: phonestrument.currentPlayer.adaptor.currentViewDivision
                });
            }
            if (selectedTab.selector == "#instrument") {
                console.log("instrument");
                instSlider1.getOffset();
            }

        }});

        $('#saveButton').click(function(){
            console.log("Saving:...");
            phonestrument.fileOps.saveCurrentPiece(phonestrument);  // sending it itself? Seems odd (so just do from phonestrumet and let it send itself)
            //phonestrument.fileOps.saveCurrentPiece();
        });

        $('#readButton').click(function(){

            phonestrument.readPiece();
            console.log("Reading:...");
            
        });

        $('#setDemo').click(function(){
            phonestrument.setDemo();
            console.log("Setting demo:...");
        });


    });
})

// document.addEventListener("deviceready", onAppReady, false) ;
// document.addEventListener("onload", onAppReady, false) ;

// The app.Ready event shown above is generated by the init-dev.js file; it
// unifies a variety of common "ready" events. See the init-dev.js file for
// more details. You can use a different event to start your app, instead of
// this event. A few examples are shown in the sample code above. If you are
// using Cordova plugins you need to either use this app.Ready event or the
// standard Crordova deviceready event. Others will either not work or will
// work poorly.

// NOTE: change "dev.LOG" in "init-dev.js" to "true" to enable some console.log
// messages that can help you debug Cordova app initialization issues.
nx.onload = function(){
    console.log("nexusUI loaded from app.js");
    nx.colorize("#00CCFF"); // sets accent (default)
    nx.colorize("border", "#222222");
    nx.colorize("fill", "#8E8E8E");
    //  playButton.mode = "toggle";
    // addItemButton.mode = "toggle";
    //    rewindButton1.getOffset();

    octaveComment.val.text="4";
    barnumberComment.val.text="0";
    togglePanVol.val.value = 1;
    togglePanVol.draw();

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

    partLength.set({
        value: 4
    })

    partLength.on('*', function(data){
        phonestrument.currentPlayer.adjustPartLength(data.value);
        //console.log("Lengthened by " + data);

    })

    divisionNumber.set({
        value: sequencerDivision
    })
    divisionNumber.min = 4;
    divisionNumber.max = 16;
    divisionNumber.decimalPlaces = 0;
    divisionNumber.on('*', function(data){
        //console.log(data);
        sequencerDivision = data.value;
        seqMatrix.col = sequencerDivision;
        seqMatrix.draw();

        phonestrument.currentPlayer.adaptor.currentViewDivision = sequencerDivision;
    })

    addItemButton.on('*', function(data) {
        console.log(data);
        if (data.press == 0) {  // seems odd but that's how it's working?
        mainStage.addItem();
        phonestrument.createNewPlayer();
    }
})

playerColor.on('*', function(data) {
    var hex = rgb2hex(data.r, data.g, data.b);
    //console.log("Color data: " + hex);
    currentStagePlayerColor = hex;
    mainStage.changeColor(currentStagePlayerIndex, currentStagePlayerColor);
    phonestrument.currentPlayer.interfaceInfo.stage.color = currentStagePlayerColor;
    mainStage.draw();
});

mainStage.draw();
mainStage.on('*', function(data) {

    if (panOnDrag) {
        phonestrument.currentPlayer = phonestrument.player[currentStagePlayerIndex];
        phonestrument.currentPlayer.panVol.pan.value = data.x;
    }
    if (volOnDrag) {
        phonestrument.currentPlayer = phonestrument.player[currentStagePlayerIndex];
        phonestrument.currentPlayer.panVol.volume.value = data.y * -24;
    }

    if (data.state == "release"){
        currentStagePlayerIndex = data.item;
        phonestrument.currentPlayer = phonestrument.player[currentStagePlayerIndex];
        if (data.onstage && phonestrument.currentPlayer.part.state == "stopped") {
            //var nextBar = currentBar + " + 1m";
            //console.log("starting part at " + nextBar);
            phonestrument.currentPlayer.part.start("0:0:0"); // doesn't work as expected; starts immediately

        } else if (!data.onstage && phonestrument.currentPlayer.part.state == "started") {
            //var nextBar = currentBar + " + 1m";
            //console.log("stopping part at " + nextBar);
            phonestrument.currentPlayer.part.stop("0:0:0"); // doesn't work as expected; stops immediately
        }
        // update info the player holds about stage position
        phonestrument.currentPlayer.interfaceInfo.stage.xpos = data.x;
        phonestrument.currentPlayer.interfaceInfo.stage.ypos = data.y;

    }
})

seqMatrix.row = 7;
seqMatrix.col = sequencerDivision;
seqMatrix.init();
seqMatrix.draw();

seqMatrix.on('*', function(data) {
    //console.log(data);
    var partBarForTone = partBar + ":0:0";
    phonestrument.currentPlayer.updatePart(partBarForTone, data, sequencerDivision);
    // if a mono instrument, then toggle others in column to 0
    if (phonestrument.currentPlayer.poly == false) {
        for (i=0; i < seqMatrix.row; i++) {
            if (i != data.row) {
                seqMatrix.matrix[data.col][i] = 0;
            }
        }
        seqMatrix.draw();
    }
    // change the below to the column and row? More efficient than sending whole matrix
    phonestrument.currentPlayer.updatePartView(partBar, data.col, seqMatrix.matrix, sequencerDivision);
})

octaveUpButton.on('*', function(data) {
    console.log(data);
    if (data.press == 0) {
        phonestrument.currentPlayer.adaptor.octave++;
        var currentOctave = parseInt(octaveComment.val.text, 10);
        octaveComment.val.text = (currentOctave + 1).toString();
        octaveComment.draw();
    }
})

octaveDownButton.on('*', function(data) {
    console.log(data);
    if (data.press == 0) {
        phonestrument.currentPlayer.adaptor.octave--;
        var currentOctave = parseInt(octaveComment.val.text, 10);
        octaveComment.val.text = (currentOctave - 1).toString();
        octaveComment.draw();
    }
})


var playing = false;
playButton.on('*', function(data) {
    console.log(data);
    if (data.value == 1){
        if (!playing) {
            //console.log("Starting transport");
            phonestrument.startPlaying();
            playing = true;
        }
    }
    if (data.value == 0) {
        if (playing) {
            // console.log("Stopping transport");
            phonestrument.pausePlaying();
            playing = false;
        }
    }

})

var recording = false;
recordButton.colors.accent = "#d32f2f";
recordButton.lineWidth = 10;
recordButton.on('*', function(data) {
    console.log("Recording " + data);
    if (data.value == 1){
        if (!recording) {
            //console.log("Starting transport");
            phonestrument.startRecording();
            recording = true;
        }
    }
    if (data.value == 0) {
        if (recording) {
            // console.log("Stopping transport");
            phonestrument.stopRecording();
            recording = false;
        }
    }
})

togglePanVol.on('*', function(data) {
    if (data.value == 1) {
        panOnDrag = true;
        volOnDrag = true;
    } else {
        panOnDrag = false;
        volOnDrag = false;
    }
});

}

// Utilities
//
// thanks stackoverflow: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function rgb2hex(red, green, blue) {
    var rgb = blue | (green << 8) | (red << 16);
    return '#' + (0x1000000 + rgb).toString(16).slice(1)
}
