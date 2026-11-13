const { MongoClient } = require('mongodb');
const uri =
	'mongodb+srv://kay:myRealPassword@cluster0.mongodb.net/test?w=majority';
const client = new MongoClient(uri);

async function run() {
	try {
		const collection = client.db('IoT').collection('kitty-litter');
		// perform actions on the collection object
	} finally {
		await client.close();
	}
}
run().catch(console.error);
