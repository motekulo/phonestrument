function Mainscreen() {

    var mono = new Basicmonosynth();
    var barseq = new Barsequencer();

    var mp = new Interface.Panel({ 
        container:document.querySelector("#InterfacePanel") 
    });

    console.log("Mainscreen...");

    var home = new Interface.Button({
        bounds: [0, 0, .2, .25],
        label: "Home",
        mode: 'momentary',
        onmouseup : function() {
            //    console.log("Mouse up over home");
            mp.clear();
            mp.add(home, ib1, ib2);
        }

    });

    var ib1 = new Interface.Button({
        bounds: [.25, 0, .2, .25],
        label: "Monosynth",
        mode: 'momentary',
        onmouseup : function() {
            mp.remove(ib1);
            mp.remove(ib2);
            mono.draw(mp);
        } 

    }
    );

    var ib2 = new Interface.Button({
        bounds: [.5, 0, .2, .25],
        label: "Bar seq",
        mode: 'momentary',
        onmouseup : function() {
            mp.remove(ib1);
            mp.remove(ib2);
            barseq.draw(mp);
        } 

    });

    this.draw = function(){
        mp.add(home, ib1, ib2);
    }

}



