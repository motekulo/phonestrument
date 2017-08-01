# Performance

## on exp 12 May 17
in browser, up to 180mb memory (using task manager in chrome) and 31k javascript (about 18k live).

Keep hitting reset button on app and overall memory use increases. Need to dispose of some things!

3 heap snapshot technique and Tone.Events and Patterns are being leaked. Nothing huge by the looks of it though?

![](images/3_heap_test_2.png "2nd heap profile")

![](images/3_heap_test_1.png "3rd heap profile")


This time without filtering for Tone, and that's a big leak.
So that was a three snapshot technique, looking at the events allocated between first two; and can see big leaks. I was pressing the reset button each time. Reset should reset!

## MonoSynth testing - browser vs mobile (Cordova Crosswalk)

I have noticed some big differences in performance with an app using Tone js for music, and Phaser for visuals. Beyond three MonoSynths, sound would become intermittent, and beyond four or five, might stop completely. This was on a Samsung A5 (2017), so a reasonably powered, modern smartphone. The test consists of creating several PatternPlayer objects (my own class) that play quarter note arpeggios simultaneously. Another class, Tonality, provides chord information.

To explore this further, I stripped out the music code from the Phaser code, to see what was going on. The same performance problems emerged.

### One MonoSynth

In the browser, here's a close up of MonoSynth triggering in the browser:

![](images/browser_one_mono.png "One MonoSynth in browser")

And the same code running on mobile:

![](images/mobile_one_mono_fast.png "One MonoSynth in mobile - fast")

That was a fast one. Here's a slow one:

![](images/mobile_one_mono_slow.png "One MonoSynth in mobile - slow")

So a fair bit of difference between fast and slow on mobile.

The same pattern is evident with two and three MonoSynths respectively. Three play ok on mobile, but at four, the sound pretty much breaks up, and is inconsistent (that's on mobile). Here's four MonoSynths in the browser:

![](images/browser_4_simul.png "Four MonoSynths in browser")

And here's four MonoSynths on the mobile:

![](images/mobile_4_simul.png "Four Monsynths in mobile")

But a faster one in this run too:

![](images/mobile_4_simul_fast.png "Four MonoSynths in mobile - but faster")

So maybe a cordova thing? Let's try the same code hosted as a website.

Desktop browser pointed at http://sandpit.motekulo.net

![](images/browser_web_4_mono.png "Four MonoSynths desktop browser - web")

Mobile stock browser Samsung A5 2017 (com.sec.android.app.sbrowser)

Slow:

![](images/mobile_web_4_slow.png "Four MonoSynths mobile browser slow")

Fast:

![](images/mobile_web_4_fast.png "Four MonoSynths mobile browser fast")

So far then, performance as a Cordova crosswalk app is the worst. That's unfortunate as it's the environment I hope to work in.

Next step, try speed in chrome browser on android (so not Samsung internet version0).

Then try more bleeding edge cordova crosswalk (see https://crosswalk-project.org/documentation/cordova.html - the optional Android platform only workflow).

Then try without crosswalk at all.

Then try other devices.

Consider a nexusUI interface with Tone js to add and remove different types of PatternPlayers to see what the performance limits are.

Test on more mobile devices. That should probably be priority 1. There are so many devices, that something non-Samsung should be checked first. Need to have that hardware testing thing sorted. Hard to firebase test an app like this, as we need to be able to hear the sound playing. Try testing in Firebase (check out the video that results, for example).

<table>
    <tr>
        <td>Platform</td><td>Version</td><td>Slow</td><td>Fast</td>
    </tr>
    <tr>
        <td>Cordova app running in browser</td><td></td><td>1.13ms</td><td></td>
    </tr>
    <tr>
        <td>Cordova app with Crosswalk- Android mobile</td><td>Crosswalk stable 23+</td><td>25ms</td><td>9ms</td>
    </tr>
    <tr>
        <td>Web app from browser</td><td></td><td>2ms</td><td></td>
    </tr>
    <tr>
        <td>Web app from mobile</td><td></td><td>24ms</td><td>4.5ms</td>
    </tr>
    <tr>
        <td>Web app from mobile</td><td>Chrome</td><td>37ms</td><td>2.4ms</td>
    </tr>
</table>


On Samsung A5; can get 4 samplers, 4 pitched samplers, then start getting glitches with 2 MonoSynths:

W/chromium: [WARNING:audio_sync_reader.cc(132)] AudioSyncReader::Read timed out, audio glitch count=1

9 pitched samplers, the glitches

3 MonoSynths, then glitches

31 unpitched samplers (so Tone.Player) before glitches

1 MonoSynth, 8 unpitched samplers, 8 pitched samplers; ok for quite a while

That was all with this set:

    Tone.Transport.latencyHint = 'playback';

Tried ths instead:

    Tone.context.latencyHint = 'playback';

Should actually be the same thing (and a value of 0.8secs)

Managed 12 pitched samplers before glitches, though did get some moments of really weird rhythm (so no longer quarter notes, but some missed, some quicker? seemed to be in time though).

So doubling that to 1.6secs