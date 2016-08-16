/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

// hacks to get through demo to research group
var demoPieceData = {
    "name": "",
    "tempo": 150,
    "key": "C",
    "players":[]
};

var demoDataRead = false;
var readError = false;

PieceFileOps = function(){
    this.autoSave = 120;  //seconds

    this.pieceData = {
        "name": "",
        "tempo": 116,
        "key": "C",
        "players":[]
    }

}

// Thanks to Frank Reding for this:
//    https://www.neontribe.co.uk/cordova-file-plugin-examples/

PieceFileOps.prototype.writeToFile = function(fileName, data) {
    data = JSON.stringify(data, null, '\t');
    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (directoryEntry) {
        directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
            fileEntry.createWriter(function (fileWriter) {
                fileWriter.onwriteend = function (e) {
                    // for real-world usage, you might consider passing a success callback
                    console.log('Write of file "' + fileName + '"" completed.');
                };

                fileWriter.onerror = function (e) {
                    // you could hook this up with our global error handler, or pass in an error callback
                    console.log('Write failed: ' + e.toString());
                };

                var blob = new Blob([data], { type: 'text/plain' });
                fileWriter.write(blob);
            }, errorHandler.bind(null, fileName));
        }, errorHandler.bind(null, fileName));
    }, errorHandler.bind(null, fileName));
}

PieceFileOps.prototype.saveCurrentPiece = function(phonestrument){

    // Encode phonestrument level data - tempo, key
    this.pieceData.name = phonestrument.name;
    this.pieceData.tempo = phonestrument.tempo;
    this.pieceData.key = phonestrument.key;

    // Loop through players and Encode
    // currentPlayer.interfaceInfo.stage.xpos;
    this.pieceData.players = [];
    for (var i=0; i < phonestrument.player.length; i++) {
        var player = this._encodePlayer(phonestrument.player[i]);
        this.pieceData.players.push(player);
    }
    var fileName = phonestrument.name + ".json";
    this.writeToFile(fileName, this.pieceData);

}

PieceFileOps.prototype.readPiece = function(phonestrument) {
    var entries = [];
    console.log("in readPiece with data: " + demoPieceData.tempo);
    this._listDir(cordova.file.externalDataDirectory);

    var evilDemoHack = setInterval(function(){
        console.log("waiting on read...");
        if (demoDataRead == true || readError == true) {
            clearInterval(evilDemoHack);
            console.log("and after reading with data: " + demoPieceData.tempo);
        }
    }, 100);

    // var fileData;
    // this._readFromFile(entries[0], function (data) {
    //     fileData = data;
    // });
    // console.log("fileData: " + fileData);
}

// thanks Stackoverflow: http://stackoverflow.com/questions/26282357/cordova-file-plugin-read-from-www-folder
PieceFileOps.prototype._listDir = function(path){
    var fileEntries = [];
    var this1 = this;
    window.resolveLocalFileSystemURL(path,
    (function (fileSystem) {
      var reader = fileSystem.createReader();
      var this2 = this;
      reader.readEntries(
        (function (entries) {
          console.log(entries);
          var this3 = this;
          // loop through entrues; find demo and read it
          for (var i = 0; i < entries.length; i++){
            if (entries[i].name == "demo.json") {
                console.log("Gotcha demo...");
                var fileEntry = entries[i];
                fileEntry.file(function (file) {
                    var reader = new FileReader();

                    reader.onloadend = function (e) {
                        //cb(JSON.parse(this.result));
                        console.log("Got demo data: " + this.result);
                        demoPieceData = JSON.parse(this.result);
                        demoDataRead = true;
                    };

                    reader.readAsText(file);
                }, errorHandler.bind(null, fileEntry.name));


                // this._readFromFile(entries[i], function (data) {
                //     this.demoPieceData = data;
                //     console.log("Got demo data: " + data);
                // });
            }
          }
          //fileEntries = entries;
      }).bind(PieceFileOps),
        function (err) {
          console.log(err);
          readError = true;
        }
      );
  }).bind(PieceFileOps), function (err) {
      console.log(err);
      readError = true;
    }
);


}

// thanks to Frank Reding - https://www.neontribe.co.uk/cordova-file-plugin-examples/
PieceFileOps.prototype._readFromFile = function(fileEntry, cb) {
    fileEntry.file(function (file) {
        var reader = new FileReader();

        reader.onloadend = function (e) {
            cb(JSON.parse(this.result));
        };

        reader.readAsText(file);
    }, errorHandler.bind(null, fileEntry.name));
}

PieceFileOps.prototype._encodePlayer = function(player) {
    // A player has only one part
    var playerData = {
        "xpos": player.interfaceInfo.stage.xpos,
        "ypos": player.interfaceInfo.stage.ypos,
        "color": player.interfaceInfo.stage.color,
        "instrument": {
            "type": "mono",
            "wave": "triangle",
            "samples": []
        },
        "events": []
    }
    var partToEncode = player.part;
    var partEvents = [];
    for (var i = 0; i < partToEncode._events.length; i++) {

        var value = partToEncode._events[i].value;
        console.log("Event value " + value);

        var offset = partToEncode._events[i].startOffset;
        console.log("startOffset " + offset);

        var event = {
            "note": value,
            "offset": offset
        }
        partEvents.push(event);
    }
    playerData.events = partEvents;
    return playerData;
}

var errorHandler = function (fileName, e) {
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'Storage quota exceeded';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'File not found';
            break;
        case FileError.SECURITY_ERR:
            msg = 'Security error';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'Invalid modification';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'Invalid state';
            break;
        default:
            msg = 'Unknown error';
            break;
    };

    console.log('Error (' + fileName + '): ' + msg);
}
