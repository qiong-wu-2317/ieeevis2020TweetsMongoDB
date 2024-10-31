import { MongoClient } from "mongodb";

const db_uri = "mongodb://localhost:27017";
const client = new MongoClient(db_uri);

async function run(){
    try{
        const db = client.db("ieeevisTweets");
        const tweetCollection = db.collection("tweet");
        const query = {
            $and:[
              {in_reply_to_status_id:null},
              {$or: [{retweeted_status:null},{retweeted_status:{$exists: false}}]}
            ]
        };
        const tweets = await tweetCollection.find(query).toArray();

        console.log(`${tweets.length} tweets are not retweets or replies`);

    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}

run();