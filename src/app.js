var Twitter = require('twitter');
var env = require('dotenv').config().parsed || process.env;
var streamError = require('./streams/error');
var express = require('express');
var app = express();
var pug = require('pug');
var currentHashtag = env.CURRENT_HASHTAG;

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
var currentCounter = 0;

client.stream('statuses/filter', streamParameters, function (stream) {
  stream.on('data', () => {
    console.log('hashtag detected'); 
    tweetCounter++;
  })
  stream.on('error', streamError);
});

app.get('/tweet-count', function (req, res) {
  res.send(tweetCounter.toString());
});

app.get('/reset', function(req, res) {
  tweetCounter = 0;
  currentCounter = 0;
  res.sendStatus(200);
});

app.get('/', function (req, res) {
  welcomeHTML = pug.renderFile(__dirname + '/html/welcome.pug',{currentHashtag})
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(welcomeHTML);
  res.end();
});

module.exports = app;
