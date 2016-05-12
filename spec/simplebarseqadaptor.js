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
        var data = ["2:0:0", 0, 1, 1];  // simple bar seq sends transport pos, row, col, val
        var converteddata = [];
        converteddata = adaptor.convertData(data);
        expect(converteddata[0]).toBe(0);
        expect(converteddata[1]).toBe("2:0:0 + (1 * 16n)");
        expect(converteddata[2]).toBe("C4");

    });


});

