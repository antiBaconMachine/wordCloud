# Express Bootstrap

General scaffold for a web app. Based on express generator with a few of my preferred packages sprinkled in.

## Usage

`npm install` - Install all dependencies. Also installs front end bower dependencies (See below)

`npm test` - Runs jshint and jasmine tests

`npm start` - Start the server. Defaults to http://localhost:3000

## Back end

The app is obviously served by express. The views are largely offloaded to the front end but there are simple jade
templates for the basic html scaffold.

The back end is designed to run in node 4.2.1 and therefore uses plenty of ecma6 idioms.

## Front End

The front end is amd packaged and loaded using requirejs.

The front end is targeted at 'modern' browsers which largely support ecma6. In general however, I'm much more
conservative in the use of ecma6 on the front end so as to support older browsers.

Front end dependencies are managed by bower. This does create some duplication with npm. This is because npm does not
[yet](http://blog.npmjs.org/post/101775448305/npm-and-front-end-packaging) provide a clean standard way to share
dependencies between front and back ends. The bower registry is also a bit more complete when it comes to things we want
for the front end. I currently consider bower to be the best tool for the job so I put up with the duplication.