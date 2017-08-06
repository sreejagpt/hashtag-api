var Twitter = require('twitter');
var env = require('dotenv').config().parsed || process.env;
var streamError = require('./streams/error');
var currentHashtag = env.current_hashtag;
var express = require('express');
var app = express();

app.set('port', (env.PORT || 5000));

var client = new Twitter({
  consumer_key: env.CONSUMER_KEY,
  consumer_secret: env.CONSUMER_SECRET,
  access_token_key: env.ACCESS_TOKEN_KEY,
  access_token_secret: env.ACCESS_TOKEN_SECRET
});

var streamParameters = {
  track: currentHashtag
};

var tweetCounter = 0;

client.stream('statuses/filter', streamParameters, function (stream) {
  stream.on('data', () => {tweetCounter++})
  stream.on('error', streamError);
});

app.get('/count', function (req, res) {
  res.send(tweetCounter.toString());
});

app.get('/reset', function(req, res) {
  tweetCounter = 0;
  res.sendStatus(200);
});

app.get('/', function (req, res) {
  var welcomeHTML = "Welcome to hashtag-api." +
  "<br/>Visit <b>/count</b> to see number of mentions of " + currentHashtag +
  "<br/>Visit <b>/reset</b> to reset the current tweet count for whatever reason."

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(welcomeHTML);
  res.end();
});

module.exports = app;
