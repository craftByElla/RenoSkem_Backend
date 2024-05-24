const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  username: String,
  text: String,
  likes: {type: Number, default: 0},
  time: Date,
});

const Tweet = mongoose.model('tweets', tweetSchema);

module.exports = Tweet;