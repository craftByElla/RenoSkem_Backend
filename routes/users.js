var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');

const { checkBody } = require('../modules/checkBody');


router.post('/postUser', (req, res) => {
  if (!checkBody(req.body, ['username', 'email', 'password', 'skills'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar,
        skills: req.body.skills
      });

      newUser.save().then(data => {
        res.json({ result: data});
      });
    })

    
    router.get("/getUser/:email", (req, res) => { 
      User.findOne({email: req.params.email}).then(data => {
        res.json({ result: data });
      });
    });
    


router.delete("/deleteUser/:id", (req, res) => { 
  User.findOne({_id: req.params.id}).then(data => {
    User.deleteOne(data).then(
          res.json({ result: true})
        )
    })
  })


module.exports = router;

