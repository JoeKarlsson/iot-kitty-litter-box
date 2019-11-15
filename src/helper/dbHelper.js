const { cat, owner, db } = require('../config.json');
const handleError = require('./handleError.js');

const insertTimeSeriesData = (weight, client) => {
	collection = client.db(db.name).collection(db.collection);
	// perform actions on the collection object
	const NEW_EVENT = {
		timestamp_event: new Date(),
		type: 'cat',
		weight,
	};
	const NEW_DOCUMENT = {
		timestamp_day: new Date(),
		type: 'cat_in_box',
		cat,
		owner,
		events: [NEW_EVENT],
	};

	// Find if a document has been created in the last 24 hours
	collection
		.findOne({
			timestamp_day: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
		})
		.then(result => {
			// If document hasn't been created in the last 24 hours, initialize a new time series document for that day
			if (!result) {
				return collection.insertOne(NEW_DOCUMENT, (err, r) => {
					if (err) {
						handleError(err);
					}
					console.log(`new event added`);
				});
			} else {
				// if a document has been created in the last 24 hours, push the new event to the events array.
				return collection
					.update(
						{ _id: result._id },
						{
							$push: { events: NEW_EVENT },
						}
					)
					.then(() => {
						console.log('new event added');
					})
					.catch(err => {
						handleError(err);
					});
			}
		})
		.catch(err => {
			handleError(err);
		});
};

module.exports = insertTimeSeriesData;
