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
        /* From a simple bar sequencer we get row, column, value data

           A part expects a voice index (row, in this case), time, and pitch



*/
        if (data.length >= 3) {
            var row = data[0];
            var col = data[1];
            var val = data[2];

            var index = row;
            var time = col + " * 16n";
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

