/* A dump of the recording code that was used as an experiment
 * early on
 */


var recorder;
var mcontext;

recorder = new Recorder(dist);
//
// Recording buttons


var $startRecordButton = $('<button/>', {
    text: "Start", 
    id: 'recbtn',
    click: function () {
        startRecording(this);
    }
});

$("#buttons").append($startRecordButton);

var $stopRecordButton = $('<button/>', {
    text: "Stop", 
    id: 'stoprecbtn',
    click: function () {
        stopRecording(this);
    }
});

$("#buttons").append($stopRecordButton);


function startRecording(button) {
    recorder && recorder.record();
    button.disabled = true;
    button.nextElementSibling.disabled = false;
    console.log('Recording...');
}

function stopRecording(button) {
    recorder && recorder.stop();
    button.disabled = true;
    button.previousElementSibling.disabled = false;
    console.log('Stopped recording.');
    // create WAV download link using audio data blob
    createDownloadLink();
    //    recorder.clear();
}
function createDownloadLink() {
    recorder && recorder.exportWAV(function(blob) {
        var isAndroid = true;
        var url = "";
        console.log("file system is " + cordova.file.externalDataDirectory);
        if (!cordova.file.externalDataDirectory) {
            isAndroid = false;
        }
        if (isAndroid == true) {

            window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {
                //            console.log("dir is ",dir);
                console.log("Blob size is " + blob.size);
                dir.getFile("test.wav", {create:true}, function(file) {
                    console.log("file url will be " + file.nativeURL);
                    url = file.nativeURL;
                    file.createWriter(function(fileWriter) {
                        fileWriter.seek(fileWriter.length);
                        fileWriter.write(blob);
                        console.log("File written to storage");

                    });
                });


            });

        } else {
            var url = URL.createObjectURL(blob);
        }
        var li = document.createElement('li');
        var au = document.createElement('audio');
        var hf = document.createElement('a');
        au.controls = true;
        au.src = url;
        hf.href = url;
        hf.download = new Date().toISOString() + '.wav';
        hf.innerHTML = hf.download;
        li.appendChild(au);
        li.appendChild(hf);
        recordingslist.appendChild(li);

    });
}

