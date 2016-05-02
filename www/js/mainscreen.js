function Mainscreen() {

    var mono = new Basicmonosynth();

    var mp = new Interface.Panel({ 
        container:document.querySelector("#InterfacePanel") 
    });

    var home = new Interface.Button({
        bounds: [0, 0, .1, .1],
        label: "Home",
        mode: 'momentary',
        onmouseup : function() {
        //    console.log("Mouse up over home");
            mp.clear();
            mp.add(home, ib1);
        }

    });


    var ib1 = new Interface.Button({
        bounds: [.15, 0, .1, .1],
        label: "Monosynth",
        mode: 'momentary',
        onmouseup : function() {
            mp.remove(ib1);
            mono.draw(mp);
        } 

    });
    this.draw = function(){
        mp.add(home, ib1);
    }

}



