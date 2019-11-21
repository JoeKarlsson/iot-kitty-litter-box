const MongoClient = require('mongodb').MongoClient;
const uri =
	'mongodb+srv://kay:myRealPassword@cluster0.mongodb.net/test?w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true });

client.connect(err => {
	const collection = client.db('IoT').collection('kitty-litter');
	// perform actions on the collection object
	client.close();
});
