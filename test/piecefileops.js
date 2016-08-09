describe("pieceFileOps", function() {
    var phonestrument;
    var fileops;

    beforeEach(function() {
        phonestrument = new Phonestrument(120, 3, "D", 3);
        fileops = new PieceFileOps();
    });

    it("can save tempo and key of piece", function() {

        fileops.saveCurrentPiece(phonestrument);
        expect(fileops.pieceData.tempo).toBe(120);
        expect(fileops.pieceData.key).toBe("D");

    });

});
