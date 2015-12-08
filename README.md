# Word Cloud

Word cloud demo app.

## Requirements

* *NIX environment
* Node >= 4.2.1
* Firefox >= 38 / Chrome >= 46 / Safari >= 9

Earlier browsers may work but are untested.

## Usage

`npm install` - Install all dependencies. Also installs front end bower dependencies (See below)

`npm test` - Runs jshint and jasmine tests

`NODE_ENV=production npm start` - Start the server. Defaults to [http://localhost:3000](http://localhost:3000)

## Back end

The app is served by express. The views are largely offloaded to the front end but there are simple jade
templates for the basic html scaffold. This app as specified doesn't strictly need a server but I like to have it anyway as
it can make debugging easier and it's more future proof if the scope of the project grows.

The back end is designed to run in node 4.2.1 and therefore uses plenty of ECMA6 idioms.

## Front End

The front end is amd packaged and loaded using requirejs.

The front end is targeted at 'modern' browsers which largely support ECMA6. In general however, I'm much more
conservative in the use of ECMA6 on the front end so as to support older browsers.

Front end dependencies are managed by bower. This does create some duplication with npm. This is because npm does not
[yet](http://blog.npmjs.org/post/101775448305/npm-and-front-end-packaging) provide a clean standard way to share
dependencies between front and back ends. The bower registry is also a bit more complete when it comes to things we want
for the front end. I currently consider bower to be the best tool for the job so I put up with the duplication.

## Word cloud implementations

I've provided two implementations of the cloud:

### DOM

This models the tags as inline blocks with random baseline alignments to create a reasonably haphazard arrangement. The
lines are still clearly visible however so it's not very cloudlike. It is nice and simple to implement and it's responsive
by default as we can rely on the browser to reflow the page for us.

### Spiral (beta)

This uses absolute positioning to lay out elements along an Archimedian spiral. A quadtree is used to detect
collisions and nudge the elements around until a good fit is found.

The result is a much more pleasing cloud like layout, but we loose all assistance that the browser normally provides for
layouts. I've marked this design as beta as I have not yet implemented redraws on screen resize and it has not had as much
general testing and tinkering as the other layout.

## Donut charts

Donut breakdown charts are shown when a topic is clicked, courtesy of d3pie.

## Missing stuff

Obviously the app isn't perfect, there are a few things I haven't got around to:

* RequireJS Optimisation - I felt like my time was better spent elsewhere, suffice to say if this app was going to
production I would minify, and possibly offload some deps to a CDN
* More complete tests - The unit tests for more algorithmic parts of the app were a no brainer. Beyond that I didn't feel
I had the scope for integration tests.
* More complete responsive design - The app should nominally work on mobile devices. There is a little responsive magic, but
it wasn't my foremost priority. Consequently the mobile experience is probably a bit rough around the edges.
* IE Testing - The spec shows significant IE usage. I didn't physically have a windows install to hand at time of writing so
IE support is unknown.