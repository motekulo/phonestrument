describe("Simple bar sequencer adaptor", function() {
    var adaptor;

    beforeEach(function() {
        adaptor = new SimpleBarSequencerAdaptor();
        part = new Part();
        adaptor.connectToPart(part);
    });

    it("should be able to be connected to a part", function() {
        expect(adaptor.part).toBeDefined();

    });

    it("should be able to receive data to convert ", function() {
        var data = [0, 1, 1]  // simple bar seq sends row, col, val
        adaptor.convertData(data);
        expect(adaptor.index).toBe(0);
        expect(adaptor.time).toBe("1 * 16n");
        expect(adaptor.note).toBe("C4");

    });


});

