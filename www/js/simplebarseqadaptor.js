function SimpleBarSequencerAdaptor() {
    var octave = 4; // fudge for now
    var pitch = ["C","D","E","F"]; // fudge it for now

    // converts from:
    // Array of data in row, column, value form
    //
    // converts to:
    // voice index, time (eg "1 * 4s"), pitch (eg "C4)
    //

    this.part = null;

    this.connectToPart = function(part) {
        this.part = part;

    }

    this.convertData = function(data) {
        /* From a simple bar sequencer we get position (transport), row, column, value data

           A part expects a voice index (row, in this case), time, and pitch



*/
        if (data.length >= 4) {
            var pos = data[0];
            var row = data[1];
            var col = data[2];
            var val = data[3];

            var index = row;
            //var time = col + " * 16n";
            var time = pos + " + (" + col + " * 16n)";
            console.log("Time is " + time);
            if (val == 1) {
                note = pitch[row] + octave;
            } else {
                note = null;
            }
            var converteddata = [index, time, note];
            return converteddata;
        }

    }

    this.sendConvertedDataToPart = function(data) {
        var index = data[0]; //FIXME indexed collection would be better
        var time = data[1];
        var note = data[2];
        this.part.setNoteArray(index, time, note);
    }


}

