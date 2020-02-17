const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const productRoutes= require("./routes/products");
const userRoutes= require("./routes/user");

mongoose.connect("mongodb+srv://amir:YE8a4iHixhaXfD3N@cluster0-sea9l.mongodb.net/handicraftDB")
.then(() => {
  console.log('connected to database successfully!');
}).catch(() => {
  console.log('Oops! something went wrong ):');

})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use('/api/products',productRoutes);
app.use("/api/user", userRoutes);


module.exports = app;
