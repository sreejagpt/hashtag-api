var Twitter = require('twitter');
var env = require('dotenv').config().parsed || process.env;
var streamError = require('./streams/error');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var pug = require('pug');
var currentHashtag = env.CURRENT_HASHTAG;

app.set('port', (env.PORT || 5000));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var client = new Twitter({
  consumer_key: env.CONSUMER_KEY,
  consumer_secret: env.CONSUMER_SECRET,
  access_token_key: env.ACCESS_TOKEN_KEY,
  access_token_secret: env.ACCESS_TOKEN_SECRET
});

var stream = null;
var tweetCounter = 0;

function FollowHashTag(word){
  if (stream != null) {
    console.log("=============");
    console.log("destroyyyyyyy");
    stream.destroy();
  }

  console.log("==============");
  console.log(word);
  currentHashtag = word;
  tweetCounter = 0;
  stream = client.stream('statuses/filter',{track: word});
  stream.on('data', function(event) {
    tweetCounter++;
    console.log(event && event.text);
  });

  stream.on('error', function(error) {
    throw error;
  });
}

app.get('/count', function (req, res) {
  res.send(tweetCounter.toString());
});

app.get('/reset', function(req, res) {
  tweetCounter = 0;
  res.sendStatus(200);
});

app.post('/updateHashTag',function(req, res) {
  FollowHashTag(req.body.hashTag);
  res.redirect('/');
});

app.get('/', function (req, res) {
  if (stream == null) {
    FollowHashTag(currentHashtag);
  }

  welcomeHTML = pug.renderFile(__dirname + '/html/welcome.pug',{currentHashtag})
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(welcomeHTML);
  res.end();
});

module.exports = app;
