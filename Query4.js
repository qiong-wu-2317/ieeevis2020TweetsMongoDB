import { MongoClient } from "mongodb";

const db_uri = "mongodb://localhost:27017";
const client = new MongoClient(db_uri);

async function run(){
    try{
        const db = client.db("ieeevisTweets");
        const tweetCollection = db.collection("tweet");

        const aggre = [
            {
              $group: {
                _id: "$user.id",   //group by user id
                name: { $first: "$user.name" },  //find name
                screen_name: { $first: "$user.screen_name" },
                avg_retweet_count:  {$avg : "$retweet_count"}, //find average retweet count
                tweet_count: { $sum: 1}  // find total tweet
              }
            },
            {
              $match : {
                tweet_count : {$gt : 3}  // after tweeting more than 3 times
              } 
            },
            {
              $sort: {
                avg_retweet_count: -1 // order by avg_retweet_count desc
              }
            },
            {
              $limit:10 // top 10
            },
            {
              $project: {
                name: "$name",
                screen_name: "$screen_name",
                avg_retweet_count: { $round: ["$avg_retweet_count", 2] } // Round to 2 decimal places
              }
            },
          ]

        const tweets = tweetCollection.aggregate(aggre);


        console.log("The top 10 people that got more retweets in average, after tweeting more than 3 times")
        for await (const tweet of tweets) {
            console.log(`${tweet.name}, screen name ${tweet.screen_name}, average retweet count: ${tweet.avg_retweet_count}`);
        }

    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}

run();