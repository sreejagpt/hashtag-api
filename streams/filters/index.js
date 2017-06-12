var TweetCounter = require('../../actions/tweetCounter.js');

var streamFilter = function(tweet) {
  console.log(tweet.user.screen_name, ' : ' , tweet.text);
  TweetCounter.incrementTweetCount();
};

module.exports = streamFilter;
