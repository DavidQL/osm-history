module.exports = {
	id: Number,
	geometry: {
	    type: String,
	    coordinates: [Number],
	},
	type: String,
	properties: {
	    id: Number,
	    lat: Number,
	    lon: Number,
	    version: Number,
	    timestamp: Number,
	    changeset: Number,
	    uid: Number,
	    user: String,
	    tags: {}
	}
}