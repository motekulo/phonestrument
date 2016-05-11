describe("Simple bar sequencer adaptor", function() {
    var adaptor;

    beforeEach(function() {
        adaptor = new SimpleBarSequencerAdaptor();
    });

    it("should be able to be connected to a part", function() {
        part = new Part();
        adaptor.connectToPart(part);
        expect(adaptor.part).toBeDefined;

    });

    it("should be able to receive data to convert ", function() {
        var data = [0, 1, 1]  // simple bar seq sends row, col, val
        expect(adaptor.setDataToConvert(data)).toBeDefined;
    });


});

