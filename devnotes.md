# Notes for Mapaga

A series of experiments linking together Phaser.io, a javascript game engine, with Tone.js, a javascript music library.

Watched a bit of Bit Trip runner for inspiration after a tip from Alex last Thursday (27 April, 2017)

World moves under p2 physics - camera and large world

Tilemap gravity good for world and camera too

sprites/out of bounds.js has example of onOutOfBounds on sprites

## May 1, 2017

exp_6 tagged; the most effective rhythm was in fact when balls were sent out straight, and bounced back against themselves in various ways. A possible variation on this:

The paddle just returns the balls; if it's not there, then the beats are removed by going out of the world.

Pressing a key adds more beats
tagged as exp_7

## May 3, 2017

exp_8 at the moment; paddle deletes balls. Adjusted the speed of the ball to match a bar across (or up and down) the screen. Different speeds likely to mean bounces have a different phase surely? Try snares with one speed (say 75% of current) versus the bass part. Could even scale it across the screen horizontally for experiments.

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
