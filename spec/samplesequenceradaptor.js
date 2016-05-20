describe("Sample sequencer adaptor", function() {
    var adaptor;

    beforeEach(function() {
        adaptor = new SampleSequencerAdaptor();
        part = new Part();
        adaptor.connectToPart(part);
    });

    it("should be able to be connected to a part", function() {
        expect(adaptor.part).toBeDefined();

    });

    it("should be able to receive data to convert ", function() {
        var data = ["2:0:0", [3], 1, 1];  // simple bar seq sends transport pos, row, col, val
        var converteddata = [];
        converteddata = adaptor.convertData(data);
        expect(converteddata[0]).toBe("2:0:0 + (1 * 16n)");
        expect(converteddata[1][0]).toBe("A.4");

        adaptor.sendConvertedDataToPart(converteddata);
        var partdata = part.tonepart.at("2:0:0 + (1 * 16n)");
        expect(partdata.value[0]).toBe("A.4");

        data = ["2:0:0", [0], 3, 1];  // simple bar seq sends transport pos, row, col, val
        converteddata = adaptor.convertData(data);
        expect(converteddata[0]).toBe("2:0:0 + (3 * 16n)");
        expect(converteddata[1][0]).toBe("A.1");

        adaptor.sendConvertedDataToPart(converteddata);
        var partdata = part.tonepart.at("2:0:0 + (3 * 16n)");
        expect(partdata.value[0]).toBe("A.1");

    });

    it("should return an array to the sample sequencer", function() {

        adaptor = new SampleSequencerAdaptor();
        part = new Part();
        adaptor.connectToPart(part);
        //adaptor.setScale("C");
        part.tonepart.at("1:0:0 + (2 * 4n)", ["A.1","A.3"]);
        part.tonepart.at("1:0:0 + (3 * 4n)", "A.2");
        part.tonepart.at("1:0:0 + (0 * 4n)", "A.4");
        var bararray = adaptor.getBarArray(1, 16); 
        expect(bararray[0][8]).toBe(1);
        expect(bararray[2][8]).toBe(1);
        expect(bararray[1][12]).toBe(1);
        expect(bararray[3][0]).toBe(1);
    });


});

