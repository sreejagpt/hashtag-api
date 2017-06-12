var Twitter = require('twitter');
var env = require('dotenv').config().parsed;

var streamFilter = require('./streams/filters');
var streamError = require('./streams/error');

var client = new Twitter({
  consumer_key: env.consumer_key,
  consumer_secret: env.consumer_secret,
  access_token_key: env.access_token_key,
  access_token_secret: env.access_token_secret
});

var streamParameters = {
  track: "#Sreeja",
};

client.stream('statuses/filter', streamParameters, function (stream) {
  console.log('attempting connection');
  stream.on('data', streamFilter);
  stream.on('error', streamError);
});
