# Notes for Mapaga

A series of experiments linking together Phaser.io, a javascript game engine, with Tone.js, a javascript music library.

Watched a bit of Bit Trip runner for inspiration after a tip from Alex last Thursday (27 April, 2017)

World moves under p2 physics - camera and large world

Tilemap gravity good for world and camera too

sprites/out of bounds.js has example of onOutOfBounds on sprites

## May 1, 2017

exp\_6 tagged; the most effective rhythm was in fact when balls were sent out straight, and bounced back against themselves in various ways. A possible variation on this:

The paddle just returns the balls; if it's not there, then the beats are removed by going out of the world.

Pressing a key adds more beats
tagged as exp\_7

## May 3, 2017

exp\_8 at the moment; paddle deletes balls. Adjusted the speed of the ball to match a bar across (or up and down) the screen. Different speeds likely to mean bounces have a different phase surely? Try snares with one speed (say 75% of current) versus the bass part. Could even scale it across the screen horizontally for experiments.

Next steps:

Just bounce off the walls. Doesn't sound as easy as initially thought; need to add some sort of rectangle around the edge that acts as a sprite. Look up how an image can be scaled to the size of the screen.

Feels like time to make a game. Balls with different velocities at a speed around the current one (a full screen width or height per bar) can make the best sounds, especially if the pitch grid is set to a particular set of chord tones (tried C6, C7).

Patrick saw the balls in motion and seemed interested; he wanted to move the paddles around and dodge balls.

That's the game idea. Move a square (modified paddle) from bottom left to top right. Dodge balls. Get hit by a normal ball, square gets bigger (and ball disappears?). Things get a bit more active every 2 bars. Every now and again a random ball flies through. If that hits the square, it's game over.

One thing - I've done a few days now without testing on mobile. From past experience that's not smart, so get back to it. Always test on mobile. Every day. Build for mobile.

### Towards exp_9

* Add movement buttons or joystick, buttons for adding balls, and test on mobile devices. See how many balls before it all wigs out.

* If all ok, remove vertical paddle, and start on game initial ball creation. Start button. Randomize balls, and increase intensity every 2 or 4 bars.

* Get the square (need a name for it) moving through the field

* On collision increase player sprite size and delete ball

* Try adding nexusUI controls for testing purposes in the browser (underneath, maybe)

### May 5 2017

Some performance problems on the Samsung Tab A. Audio in Tone barely working at
all. Tried latency fixes on Tone.context.latencyHint to no avail. The only
thing that seemed to make a difference was getting rid of the PolySynth
(converting back to MonoSynth). Leave it for now, and return later to solve it.
Things to try might be just setting up a Tone project without Phaser, trying
samples as ogg or mp3, using parts instead of quantized scheduled evetns on the
timeline, trying to schedule events further in the future. Bear in mind,
though, that not even the click track was working. That's odd in itself. Should
also try as many other devices I have to hand as well - Mareta's tablet,
Patrick's, other phones.

#### Plan:
Try timing with Tone.Player synced to transport. No matter what happens, move on with game idea:
- Initial ball creation
- increase of intensity
- square moving
- collision


### Mon 8 May 2017

Tried on Rob's Nexus 7 and performance good.

Tagged as exp\_9. Can now move on to making the game aspect of it more
complete. Some sort of explosion or effect when the paddle hits the edge, then
a popup screen after a short period that resets and starts again. Could even
start with a popup screen that has instructions? Then a pause button (smaller)
on the bottom right that actually pauses Tone.js and ball movement and movement
of main player sprite. Reduce the volume, and turn off metronome for now, too.
Can then tweak the sounds and game settings to make it more playable. Get a
complete game going at the moment though.

### Mon 15 May 2017

Have worked on chord progressions, and added a bass line so the whole thing sounds more musical. Looked at some games during the week on new phone. There aren't many engaging music games, as it turns out. There are derivative tap games - one that is 1.2GB to download in fact (Deemo) - but not much where player action affects the music. The simple games like agar.io are appealing.

Pushed current game, which has pause, play, and reset controls as exp_10.

#### From exp 11 to 20

Heading to exp_11 and beyond. Perhaps try a new tack? Use the gradually rising bubbles example from phaser. Bubbles emerge from the bottom and rise up. A different coloured bubble is the protagonist and can bounce other bubbles away. Bubbles can disappear through the top of the screen.

Musical ideas:

- Play with proximity to balls as to the music that gets made.
- General energy of ball movement could relate to musical density
- Consider relatively abstract connections between movement and musical parts
- Make it a generative, relaxing thing with a protagonist follows finger movement rather than a game that can be lost or working
- Each bubble could have some sort of unique musical character/feature going on

Coding/ Structure ideas:

- separate music from game and visual model (so have a phonestrument style object)
- consider, in fact, whether phonestrument could be used as is

Think of bubbles. Dragging them, popping them even.

enable drag on bubbles. If drag is really short, then pop them.

Perhaps focus on getting the physical movement happening with some really simple sounds and effects, then refine.

### May 16

Exp 11 tagged as a bubble player - called babol. Performance not great on mobile. exp 12 will be using a separate library and object for pattern playing, and will move to a Tone.Pattern rather than Tone.Sequence

#### Next steps:

- add transport buttons
- be able to reset
- iron out playback (note undefined?) bug

then tag as exp\_12.

#### exp 13 performance and parameters

- test performance limits
- try changing other parameters (filter? envelope?)

#### exp 14 touch

- work on touch motion; bubble motion after touch
- touch motion; be able to stop a bubble

#### exp 15 more parameters

- change probability
- change human

#### exp 16 change number of bubbles

- add bubbles
- delete bubbles

#### Ideas

This thing is starting to shape up like phonestrument was, but with a game engine... That wasn't the original intention, but seems to have emerged.

Could have the main screen as the stage. Not sure about editing individual bubbles, but possibility is there.

Not very gamelike, but that could be thought about. Could easily be really good for the linkage things


### May 17

towards exp 13

Performance - originally idea was to test limits, but today it's to try and optimise performance given how poorly it's running on mobile. Not so great on browser either really.

### May 23

Performance on mobile (Samsung A5 at least) not good beyond a couple of synths, so worth trying a few things.

Firstly, get a music environment using Tone js happening without any Phaser stuff at all. If that works, then it' something about the combination that might need fixing. Consider completely separating the music from the Phaser objects (and don't create things within a Phaser function like create()).
If it doesn't work, then we know it's a performance of Tone thing, and can then experiment by looking at what works best, and what the limits might be. I have a feeling that MonoSynths take up a fair bit of CPU time and memory, so maybe that's worth looking at. Players seem to use less CPU time. Starting to isolate things with this approach anyway.

### May 24

So now we have a music only version, and the same performance problems exist.
From a quick profile of performance, the monosynth calls were taking 13ms on the mobile phones Samsung A5. In the browser? Less than a millisecond. So is this just my code or does it happen more broadly? Could test Tone js examples, perhaps? Certainly need to isolate down to single things to test.

#### Monosynth Tone js examples

https://tonejs.github.io/examples/#monoSynth

Browser: monosynth example; triggerAttack takes 0.21ms
Mobile: 1.82 ms (on stock android chrome browser); another 0.95

Take same code from examples and try and cordovaerise them - what if the problem is with the webview?


Things to try:

No bass, no monosynths, just sample players
just MonoSynths
Simplify the music only app to fire just a single monosynth for comparison purposes


### June 16

Tested various combinations and MonoSynths bad, samplers better. Changed
structure, and made pitched and unpitched samplers as the main synths. Again,
spent a fair bit of time in the browser before testing on mobile. Must test on
mobile every day. Every day coding happens, test on mobile. Mantra.

Timing seems out on mobile, so time to play with a few things:

1. Try a music only version using the existing objects. If it's possible to
   separate the Tone js from the interface code completely, then I should be
   able to add a different app.js front end that doesn't call phaser.

2. Also try samples as mp3 files rather than wav - no difference; timing still out; faltering, stuttering, uneven

3. Try on different devices

### July 12

Went to PNG, didn't really do the phonestrument thing. On leave now, so time for some game coding for fun.

And test, test, test on mobile - particularly the new Huawei work dual sim phone.

Game idea - thinking about "Okay!" the bouncing balls to remove obstacle game, where as the ball hits an object, a sound is made. Build something similar, with a ball striking objects in a space, and triggering sounds in time on the Tonejs timeline. Just get something working, rather than thinking about it as a game so much yet. Build something, see what it sounds like.

The new branch for this will be called "krung" and will be set up as a branch on the main repository.

### July 17

Some good work on the balls bouncing thing over the last few days. Need to sort out the distortion thing (probably from too many simultaneous attempts to play a sample?) by trying to add parts for each player. Also increase height of string objects. Perhaps also try some barriers that don't do anything other than contain balls.

Wondering whether to blog about this and discuss various research questions as we go? Certainly worth doing in terms of notes to oneself, even if it doesn't get published. Brings me back to how this project connects to the research too. Wondering whether profile and connections from doing things open source more publicly is actually better than trying to set things up as a separate little business.
