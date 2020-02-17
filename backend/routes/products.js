const express = require('express');
const multer = require("multer");

const router = express.Router();
const Product = require("../models/product");
const User = require("../models/user");
const checkAuth = require("../middleware/check-auth");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});





router.post(
  "", checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const product = new Product({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      owner: req.userData.userId,
      ownerUsername: req.userData.username,
      price: req.body.price,
      category: req.body.category,
      likes: { count: 0, likedBy: [] }
    });
    product.save().then(createdProduct => {
      User.findById(req.userData.userId, (err, result) => {
        result.productsCount = result.productsCount + 1;
        result.save();
      })
      res.status(201).json({
        message: "Product added successfully",
        product: {
          ...(createdProduct._doc)
        }
      });
    });
  }
);

// router.get('/username/:username', (req, res, next) => {
//   const usernameToFind = req.params.username;
//   Product.find({ ownerUsername: usernameToFind }, (err, result) => {
//     // console.log('result is ', result);
//     res.json({ message: 'Hello', products: result });
//   })
// });

router.get('/myProducts', checkAuth, (req, res, next) => {
  const usernameToFind = req.userData.username;
  Product.find({ ownerUsername: usernameToFind }, (err, result) => {
    // console.log('result is ', result);
    res.json({ message: 'Hello', products: result });
  })
});

router.get('/favorites', checkAuth, (req, res, next) => {
  Product.find({ 'likes.likedBy': req.userData.username }, (err, result) => {
    // console.log('result is ', result);
    res.json({ message: 'Hello', products: result });
  })
});

router.get('/category/:categoryId', checkAuth, (req, res, next) => {
  const categoryToFind = req.params.categoryId;
  console.log('category ', categoryToFind);
  if (categoryToFind === '-1') {
    Product.find((err, result) => {
      // console.log('result is ', result);
      res.json({ products: result });
    });
  } else {
    Product.find({ category: categoryToFind }, (err, result) => {
      // console.log('result is ', result);
      res.json({ products: result });
    })
  }
});

router.post('/artistProducts/:artistUsername', (req, res, next) => {
  const usernameToFind = req.params.artistUsername;
  const username = req.body.username
  Product.find({ ownerUsername: usernameToFind }, (err, result) => {
    res.json({ message: 'Hello', products: result });
  })
});

router.post('/like', checkAuth, (req, res, next) => {
  const likeActionFrom = req.userData.username;
  const postId = req.body.postId;
  Product.findById(postId, (err, result) => {
    if (result) {
      if (!result.likes.likedBy.includes(likeActionFrom)) {
        result.likes.count = result.likes.count + 1;
        result.likes.likedBy.push(likeActionFrom);
        result.save();
        res.json({ message: 'liked' });
      } else {
        console.log('decrease')
        result.likes.count = result.likes.count - 1;
        result.likes.likedBy.pop(likeActionFrom);
        result.save();
        res.json({ message: 'unliked' });
      }
    } else {
      res.json({ message: 'failed' });
    }
  })
});



module.exports = router;
