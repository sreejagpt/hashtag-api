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
var TwitWords = [];
var initialized = false;

// Tracker function
function TrackWords(array){
  if (initialized) {
    console.log("=====================");
    console.log("destroyyyyyyy");
    stream.destroy();
  }

  console.log("==============");
  console.log(array.toString());
  stream = client.stream('statuses/filter',{track:array.toString()});
  stream.on('data', function(event) {
  console.log(event && event.text);
});

  stream.on('error', function(error) {
    throw error;
  });
  initialized = true;
}

// Add word
function AddTwitWord(word){
  if(TwitWords.indexOf(word)==-1){
    TwitWords.push(word);
    TrackWords(TwitWords);
  }
}

// Remove word
function RemoveTwitWord(word){
  if(TwitWords.indexOf(word)!=-1){
    TwitWords.splice(TwitWords.indexOf(word),1);
    TrackWords(TwitWords);
  }
}

app.get('/count', function (req, res) {
  res.send(tweetCounter.toString());
});

app.get('/reset', function(req, res) {
  tweetCounter = 0;
  res.sendStatus(200);
});

app.post('/updateHashTag',function(req, res) {
  AddTwitWord(req.body.hashTag);
  RemoveTwitWord(currentHashtag);
  currentHashtag = req.body.hashTag;
  tweetCounter = 0;
  res.sendStatus(200);
});

app.get('/', function (req, res) {
  AddTwitWord(currentHashtag);
  welcomeHTML = pug.renderFile(__dirname + '/html/welcome.pug',{currentHashtag})
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(welcomeHTML);
  res.end();
});

module.exports = app;
