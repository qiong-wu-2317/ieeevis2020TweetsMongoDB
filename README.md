# ieeevis2020TweetsMongoDB
Assignment 5 use MongoDB

## install db
Run MongoDB thru docker
```
docker run --user=mongodb -p 27017:27017 --restart=no --runtime=runc -d mongodb/mongodb-community-server:latest
```
Download tweets database from https://johnguerra.co/viz/influentials/ieeevis2020/ieeevis2020Tweets.dump.bz2 <br />

decompress by running:
```
lbzip2 -d ieeevis2020Tweets.dump.bz2  
```
make sure that you have a ieeevis2020Tweets.dump file. <br />

import data into MongoDB
```
mongoimport -h localhost:27017 -d ieeevisTweets -c tweet --file ieeevis2020Tweets.dump
```

## initial node.js
in the root folder of the project
```
node install
```

## Query

* Query 1: How many tweets are not retweets or replies? (hint the field retweeted_status contains an object when the tweet is a retweeet)

```
node Query1.js
```

* Query 2: Return the top 10 screen_names by their number of followers.

```
node Query2.js
```

* Query 3: Who is the person that got the most tweets?

```
node Query3.js
```

* Query 4: Who are the top 10 people that got more retweets in average, after tweeting more than 3 times

```
node Query4.js
```

* Query 5: Write the instructions that will separate the Users information into a different collection

```
node Query5.js
```



