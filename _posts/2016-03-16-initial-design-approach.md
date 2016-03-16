---
layout: post
title:  "Initial design approach"
date:   2016-03-16 17:35:00 +1100

categories: status update
---
# Making music on a phone

There are lots of amazing music making apps out there for Android already. One
of my favourites at the moment is [NodeBeat](http://nodebeat.com/). [Smule](http://www.smule.com), of course, have some wonderful instruments and social music
making apps, building from and on the work of the pioneering [Ge Wang](https://ccrma.stanford.edu/~ge/).

Other music production tools, but I hope to be corrected, seem to either
involve more sophisticated music production skills and knowledge, a constant
Internet connection, and/or payment, of course. Those aren't bad things at all,
by any means, but there is an ethnomusicological component to this work, where
conditions, expectations and approaches can be different, so let me explain
that a bit further.

People making popular music in
[Melanesia](https://en.wikipedia.org/wiki/Melanesia) tend to do so on PCs in
the main urban centres. Music is distributed digitally, but the production is
increasingly amateur. There is a growing body of songs, for example, by
Melanesians protesting the treatment of West Papuans by Indonesians. Here's an
example or two:

[Melanesia for free West Papua Merdeka song By Soul Jay Solomon Islands](https://www.youtube.com/watch?v=kv9SQap_9z4)

[INDEPENDENT HYPE ''PAPUA MERDEKA'' - JAGARIZZAR](https://www.youtube.com/watch?v=Ze8Kf3HHVjk&index=7&list=PLbnE0gGnABakeGFjUvW3XwzvjaV-8qyaF)

Search Youtube for "West Papua Protest songs" and you'll see lots more, with
varying approaches to production. The most straightforward, of course, is just
recording a [live performance](https://www.youtube.com/watch?v=GMNBCu8iDKA).

So to make most of these songs, you need some basic music hardware - a
microphone, a computer, and of course electricity. And skills, but I'll leave
that aside for the moment. For many, if not most Melanesians, and certainly
those in rural areas, there is no grid power. There aren't many (usually none)
computers in villages.

There are smartphones though. Imagine if people could use the microphones and
software on their phones to make this sort of music? It might not have the same
production values as some of the above, sure, but would certainly open up
possibiliites for thousands more people to make their own music.

I think it should be easier than it currently is to do that, and that's why this project is underway. 

# A simple, practical direction for design

* Listen to a subset of current Melanesian songs circulating on the Internet

* Build an app, or suite of apps, that allow that music to be created on smartphones.

* Bear in mind tenets from the [music technology manifesto](http://www.musictechifesto.org).

* So, I'm starting with the drums. The current code is getting close to being able to create a simple drum part, of chosen length, beat subdivision, and tempo.

* Then I'll move on to the bass, then keyboard and other rhythm parts, and lead parts.

* Overdubbing vocal parts will happen last, and at this stage I'll aim to
  export the completed track as a wav file, then import into another app I've
developed called
[Twotrack](https://play.google.com/store/apps/details?id=net.motekulo.twotrack&hl=en)
which allows overdubbing. That has some latency issues to be fixed (or rather,
worked around, sigh...), but hey, there's lots of things to fix and work
around!












