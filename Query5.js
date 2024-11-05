import { MongoClient } from "mongodb";

const db_uri = "mongodb://localhost:27017";
const client = new MongoClient(db_uri);

async function run(){
    try{
        const db = client.db("ieeevisTweets");
        const tweetCollection = db.collection("tweet");

        const aggre_user = [
            {
              $group: {
                _id: "$user.id", // Group by user id
                user: { $first:"$user" }
              }
            },
            {
              $replaceRoot: { newRoot: "$user" } // Replace user field
            },
            {
                $addFields: { _id: "$id" } // add id
            },
            {
                $out: "user"
            }
          ]
        
        await tweetCollection.aggregate(aggre_user).toArray();

        const userCollection = db.collection("user");

        const user_count = await userCollection.countDocuments();

        console.log(`${user_count} users were inserted`);

        const aggre_tweet = [
            {
                $addFields: { user_id: "$user.id" } // add user id
            },
            {
              $project: {
                user: 0    // exclusive user object
              }
            },
            {
              $out: "Tweets_Only"
            }
          ]

        await tweetCollection.aggregate(aggre_tweet).toArray();

        const tweetOnlyCollection = db.collection("Tweets_Only");

        const tweet_only_count = await tweetOnlyCollection.countDocuments();

        console.log(`${tweet_only_count} tweets were inserted`);

        const first = await tweetOnlyCollection.findOne();

        console.log(`Sample of 1 documents`);
        console.log(JSON.stringify(first));

    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}

run();