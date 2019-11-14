const { cat, owner, db } = require('../config.json');
const handleError = require('./handleError.js');

const insertTimeSeriesData = (data, client) => {
	collection = client.db(db.name).collection(db.collection);
	// perform actions on the collection object

	// Insert a single document
	collection.insertOne({ weight: data }, (err, r) => {
		if (err) {
			handleError(err);
		}

		// client.close();
	});
};

module.exports = {
	insertTimeSeriesData,
};
