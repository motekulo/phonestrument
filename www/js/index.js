/*
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

    var synth = new Tone.SimpleSynth().toMaster();
    synth.triggerAttackRelease("C4", "8n");
    console.log("console log test")

    panel = new Interface.Panel({ useRelativeSizesAndPositions:true }) // panel fills page by default, alternatively you can specify boundaries

        slider2 = new Interface.Slider({
        bounds: [.1,0,.1,.5],
        target : synth,
        key : 'frequency',
        param : "frequency",
        name : "frequency",
        max : 1000
    })

    button1 = new Interface.Button({
        bounds: [0,0,.1,.5],
        target : synth,
        //key : 32, //spacebar
        mode: 'toggle',
        text : "Trigger Attack",
        ontouchmousedown: function() {
            synth.triggerAttack();
            //synth.triggerAttackRelease("C4", "8n");
        },
        ontouchmouseup: function() {
            synth.triggerRelease();
            //synth.triggerAttackRelease("C4", "8n");
        }
    });

    panel.add(slider2, button1)

        orientation = new Interface.Orientation({ // this only works on devices with a gyro sensor
            onvaluechange : function(pitch, roll, yaw) {
                slider2.setValue(pitch);
            }
        })
    orientation.start()

        var xy = new Interface.XY({
            childWidth: 50,
            numChildren: 6,
            background:"#111",
            target: "OSC",
            key: "/xy",
            fill: "rgba(127,127,127,.2)",
            bounds:[0,0,.6,1],
            usePhysics: true,
            detectCollisions: false,
            oninit: function() { 
                this.rainbow(); 
                this.sendValues();
            },

        });
    //    panel.add(xy);
});


