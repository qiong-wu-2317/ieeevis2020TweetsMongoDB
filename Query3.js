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
                _id: "$user.id",  //group by user id
                name: { $first: "$user.name" }, 
                screen_name: { $first: "$user.screen_name" }, 
                tweet_count: { $sum: 1} //total tweets
              }
            },
            {
              $sort: {
                tweet_count: -1
              }
            },
            {
              $limit:1
            }
          ]

        const tweets = tweetCollection.aggregate(aggre);

        const one = await tweets.next();

        console.log(`${one.name}, screen name ${one.screen_name}, got the most tweets, totally ${one.tweet_count}`);
        

        // console.log("the top 10 screen_names by their number of followers")
        // for await (const tweet of tweets) {
            
        // }

    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}

run();