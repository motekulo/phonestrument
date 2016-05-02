/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

document.addEventListener("deviceready", function(event) {

    try {
        mcontext = Tone.context;
        console.log("Loaded");
    } catch (e) {
        alert('No web audio support in this browser!');
    }

    //var main = new Mainscreen();
    //main.draw();

    var mono = new Basicmonosynth();
    var barseq = new Barsequencer();

    var mp = new Interface.Panel({ 
        container:document.querySelector("#InterfacePanel") 
    });

    console.log("Mainscreen...");

    var home = new Interface.Button({
        bounds: [0, 0, .2, .1],
        label: "Home",
        mode: 'momentary',
        ontouchend : function() {
            //    console.log("Mouse up over home");
            mp.clear();
            mp.add(home, ib1, ib2);
        }

    });

    var ib1 = new Interface.Button({
        bounds: [.25, 0, .2, .1],
        label: "Monosynth",
        mode: 'momentary',
        ontouchend : function() {
            mp.remove(ib1);
            mp.remove(ib2);
            mono.draw(mp);
        } 

    }
    );

    var ib2 = new Interface.Button({
        bounds: [.5, 0, .2, .1],
        label: "Bar seq",
        mode: 'momentary',
        ontouchend : function() {
            mp.remove(ib1);
            mp.remove(ib2);
            barseq.draw(mp);
        } 

    });

    mp.add(home, ib1, ib2);


});




