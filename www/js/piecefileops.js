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

PieceFileOps = function(){
    this.autoSave = 120;  //seconds

    this.pieceData = {
        "tempo": 116,
        "key": "C",
        players:[]
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
    //this.writeToFile('example.json', { foo: 'bar' });
    // Encode phonestrument level data - tempo, key
    this.pieceData.tempo = phonestrument.tempo;
    this.pieceData.key = phonestrument.key;
    // Loop through players and Encode


    //return phonestrument;

}

PieceFileOps.prototype._encodePlayer = function(player) {
    // A player has only one part
    var partToEncode = player.part;
    var partEvents = [];
    for (i = 0; i < partToEncode._events.length; i++) {

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
