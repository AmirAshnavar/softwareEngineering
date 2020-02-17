const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const checkAuth = require("../middleware/check-auth");


const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      username: req.body.username,
      password: hash,
      category: req.body.category,
      artisicName: req.body.artisic,
      followers: { count: 0, list: [] },
      followings: { count: 0, list: [] },
      productsCount: 0

    });
    console.log('user is ', user);
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ username: req.body.username })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign(
        { username: fetchedUser.username, userId: fetchedUser._id },
        "ASDScxczr$r2df$RFdsscdc/DCdds667/sYE8a4iHixhaXfD3N",
        { expiresIn: "1h" }
      );
      console.log('fetch ', fetchedUser, '  ', token);
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        category: fetchedUser.category,
        artisic: fetchedUser.artisicName,
        followersCount : fetchedUser.followers.count,
        productsCount : fetchedUser.productsCount,

      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Auth failed", err
      });
    });
});

router.get("/artist/:artistUsername", (req, res, next) => {
  const artistToFind = req.params.artistUsername;
  User.findOne({ username: artistToFind }, (err, result) => {
    if (result) {
      console.log('found!', result);
      res.json({
        message: 'found', userData: {
          artisicName: result.artisicName,
          followersCount: result.followers.count,
          category: result.category,
          productsCount: result.productsCount,
          followers: result.followers.list
        }
      })
    } else {
      res.json({
        message: 'NOT found'
      })
    }
  })

});


router.post('/follow', checkAuth, (req, res, next) => {
  const followActionFrom = req.userData.username;
  const artistUsername = req.body.artistUsername;
  User.findOne({ username: artistUsername }, (err, result) => {
    if (result) {
      if (!result.followers.list.includes(followActionFrom)) {
        result.followers.count = result.followers.count + 1;
        result.followers.list.push(followActionFrom);
        result.save();
        res.json({ message: 'followed' });
        User.findOne({ username: followActionFrom }, (err, res) => {
          res.followings.count = res.followings.count + 1;
          res.followings.list.push(artistUsername);
          res.save();
        });
      } else {
        result.followers.count = result.followers.count - 1;
        result.followers.list.pop(followActionFrom);
        result.save();
        res.json({ message: 'unfollowed' });
        User.findOne({ username: followActionFrom }, (err, res) => {
          res.followings.count = res.followings.count - 1;
          res.followings.list.pop(artistUsername);
          res.save();
        });
      }

    } else {
      res.json({ message: 'failed' });
    }
  })
});

module.exports = router;
