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
* OR Run app without automatic file reloading: `npm start`

Make sure to run this while physically on campus or using a CU VPN, in order to connect to the database.

# How To Use
* Visit `localhost:3000` for a sample welcome message
* Visit `localhost:3000/users/<username>/nodes` for a listing of the first 20 nodes found for `<username>`
* Visit `localhost:3000/d3/<username/` for a demonstration of the D3 plotting library. The `<username>`'s nodes per timestamp will be plotted for the first 200 nodes found. No labels yet, sorry!
