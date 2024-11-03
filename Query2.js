import { MongoClient } from "mongodb";

const db_uri = "mongodb://localhost:27017";
const client = new MongoClient(db_uri);

async function run(){
    try{
        const db = client.db("ieeevisTweets");
        const tweetCollection = db.collection("tweet");

        const aggre = [
            {$sort: {
                _id: -1 // order by time
              }
            },
            {
              $group: {
                _id: "$user.id",  //group by user id
                screen_name: { $first: "$user.screen_name" }, 
                followers_count: { $first: "$user.followers_count" } // find most recent followers count
              }
            },
            {
              $sort: {
                followers_count: -1 //order by followers count desc
              }
            },
            {
              $limit: 10 // top 10
            }
          ]

        const tweets = tweetCollection.aggregate(aggre);


        console.log("the top 10 screen_names by their number of followers")
        for await (const tweet of tweets) {
            console.log(`${tweet.screen_name}, ${tweet.followers_count} followers`);
        }

    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}

run();