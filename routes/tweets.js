var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const Tweet = require('../models/tweets');

const { checkBody } = require('../modules/checkBody');


router.post('/postTweet', (req, res) => {
  if (!checkBody(req.body, ['text'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
      const newTweet = new Tweet({
        username: req.body.username,
        text: req.body.text,
        likes: 0,
        time: Date(),
      });

      newTweet.save().then(data => {
        res.json({ result: data});
      });
    })


router.delete("/deleteTweet/:id", (req, res) => { 
    Tweet.findOne({_id: req.params.id}).then(data => {
        Tweet.deleteOne(data).then(
          res.json({ result: true})
        )
    })
  })


router.put("/updateLikes/:id/:likes", (req, res) => { 
    Tweet.findOne({_id: req.params.id}).then(data => {
        Tweet.updateOne({_id: req.params.id},{likes: req.params.likes}).then(
          res.json({ result: true})
        )
    })
  })

/*
  router.put("/updateLikes/", (req, res) => { 
    Tweet.findOne({_id: req.body.id}).then(data => {
        Tweet.updateOne({_id: req.body.id},{likes: req.body.likes}).then(
          res.json({ result: true})
        )
    })
  })
*/

router.get("/getTweets/", (req, res) => { 
    Tweet.find().then(data => {
      res.json({ result: data });
    });
  });
  

    // router.get('/findTweet', (req, res) => {
    //     Tweet.findOne({ user: req.body.user }).then(data => {
    //       if (data) {
    //         res.json({ result: true, tweet: data.text });
    //       } else {
    //         res.json({ result: false, error: 'User not found' });
    //       } 
    //     });
    //   });

module.exports = router;

