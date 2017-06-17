var Twitter = require('twitter');
var env = require('dotenv').config().parsed || process.env;
var streamError = require('./streams/error');
var currentHashtag = env.current_hashtag;
var express = require('express');
var app = express();

app.set('port', (env.PORT || 5000));

var client = new Twitter({
  consumer_key: env.consumer_key,
  consumer_secret: env.consumer_secret,
  access_token_key: env.access_token_key,
  access_token_secret: env.access_token_secret
});

var streamParameters = {
  track: currentHashtag
};

var tweetCounter = 0;

app.get('/count', function (req, res) {
  res.send(tweetCounter.toString());
});

app.get('/reset', function(req, res) {
  tweetCounter = 0;
  res.sendStatus(200);
});

client.stream('statuses/filter', streamParameters, function (stream) {
  tweetCounter++;
  stream.on('error', streamError);
});

app.get('/change-hashtag/:hashtag', function(req, res) {
  var newHashtag = req.params.hashtag;
  currentHashtag = '#' + newHashtag.trim();
  res.send('Hashtag changed to ' + currentHashtag);
});

app.get('/', function (req, res) {
  res.send("Welcome to hashtag-api. Visit /count to see number of mentions of " + currentHashtag);
});

module.exports = app;
