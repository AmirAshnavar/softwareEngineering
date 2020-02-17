const mongoose = require('mongoose');

const productScheme = mongoose.Schema({
  title:{type: String , required : true},
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  category: { type: String, required: true },
  date:{type: Date , default : Date.now},
  owner:{ type: String, required: true },
  ownerUsername:{ type: String, required: true },
  likes: {count : Number , likedBy : Array} ,
  price:{type : Number , required: true }
})

module.exports = mongoose.model('Product', productScheme);
