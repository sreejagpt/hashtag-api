var Twitter = require('twitter');
var env = require('dotenv').config().parsed || process.env;
var express = require('express');
var app = express();

app.set('port', (env.PORT || 5000));

var TweetCounter = require('./actions/tweetCounter.js');
var streamFilter = require('./streams/filters');
var streamError = require('./streams/error');
var currentHashtag = env.current_hashtag;

var client = new Twitter({
  consumer_key: env.consumer_key,
  consumer_secret: env.consumer_secret,
  access_token_key: env.access_token_key,
  access_token_secret: env.access_token_secret
});

var streamParameters = {
  track: currentHashtag
};

app.get('/count', function (req, res) {
  res.send(TweetCounter.getCurrentTweetCount());
});

app.get('/reset', function(req, res) {
  res.sendStatus(TweetCounter.resetTweetCount());
});

client.stream('statuses/filter', streamParameters, function (stream) {
  stream.on('data', streamFilter);
  stream.on('error', streamError);
});

app.get('/', function (req, res) {
  res.send("Welcome to hashtag-api. Visit /count to see number of mentions of " + currentHashtag);
});

app.get('/change-hashtag/:hashtag', function(req, res) {
  var newHashtag = req.params.hashtag;
  currentHashtag = '#' + newHashtag.trim();
  res.send('Hashtag changed to ' + currentHashtag);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
