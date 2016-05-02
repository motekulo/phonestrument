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

    var mono = new Basicmonosynth();
    //var mono = Object.create(Monosynth);
    var main = new Mainscreen();
    main.draw();
    /*makeMainPage();

    function makeMainPage() {

        var mp = new Interface.Panel({ 
            container:document.querySelector("#InterfacePanel") 
        });

        var ib1 = new Interface.Button({
            bounds: [.05, .05, .1, .1],
            label: "Monosynth",
            mode: 'momentary',
            onvaluechange : function() {
            //    $('#InterfacePanel').empty();
                mono.draw(mp);
                //var mono = new monosynth();

            } 

        });

        mp.add(ib1);

    }
*/
});




