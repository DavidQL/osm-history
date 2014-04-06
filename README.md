# OSM-History

This is a Node web application to interact with OSM history data.
Currently this doesn't do much of anything. Prototype, setup code. 

# Setup

* Install Node: [http://nodejs.org/](http://nodejs.org/)
* Clone this repo: `git clone https://github.com/DavidQL/osm-history osm-history`
* Enter the directory: `cd osm-history`
* Intall app dependencies: `npm install`
* Install automatic app reloading: `npm install -g nodemon`
* Run app with automatic file reloading: `nodemon ./bin/www`
* Run app without automatic file reloading: `npm start`

Make sure to update the mongodb URL in `app.js` to point to your locally running MongoDB instance.