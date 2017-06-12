var Twitter = require('twitter');
var env = require('dotenv').config().parsed || process.env;
env = process.env;
var express = require('express');
var app = express();

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

console.log(env);

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

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
});
