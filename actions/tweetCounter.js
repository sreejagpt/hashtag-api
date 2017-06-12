var state = {
  tweetCount: 0
}

var incrementTweetCount = function() {
  var oldTweetCount = state.tweetCount;
  state.tweetCount = oldTweetCount + 1;
  console.log("Just incremented tweetCount to " + state.tweetCount);
}

var resetTweetCount = function() {
  state.tweetCount = 0;
  console.log("Just reset tweetCount to " + state.tweetCount);
  return 200;
}

var getCurrentTweetCount = function() {
  return state.tweetCount.toString();
}

module.exports.incrementTweetCount = incrementTweetCount;
module.exports.getCurrentTweetCount = getCurrentTweetCount;
module.exports.resetTweetCount = resetTweetCount;
