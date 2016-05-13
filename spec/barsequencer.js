
describe("Bar sequencer", function() {
    var seq;
    var adaptor;
    var part;

    beforeEach(function() {
        seq = new BarSequencer();
        adaptor = new SimpleBarSequencerAdaptor();
        seq.setAdaptor(adaptor)
        part = new Part();
        adaptor.connectToPart(part);
    });

    it("can set bar then query adaptor for notes info", function() {
        part.addVoice();
        part.addVoice();
        part.setNoteArray(0, "1:0:0 + (2 * 4n)", "D5");
        part.setNoteArray(0, "1:0:0 + (3 * 4n)", "E5");
        part.setNoteArray(1, "1:0:0 + (0 * 4n)", "D5");
        part.setNoteArray(1, "1:0:0 + (1 * 4n)", "E5");
        var bar = 1;
        var division = "16";
        var timestring;
        var bararray = seq.setCurrentBarNum("1:0:0");
        
        expect(bararray[0][0]).toBe(0);
        expect(bararray[0][8]).toBe(1);
        expect(bararray[0][12]).toBe(1);
        expect(bararray[1][0]).toBe(1);
        expect(bararray[1][4]).toBe(1);
        expect(bararray[1][12]).toBe(0);

    });



});
