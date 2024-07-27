var express = require('express');
var router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
const connectDb = require('../models/db');
// Endpoint GET để lấy danh sách sản phẩm
router.get('/', async (req, res) => {
    try {
      const db = await connectDb();
      const productsCollection = db.collection('products');
      const products = await productsCollection.find().toArray();
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  router.get('/category', async (req, res) => {
    try {
      const db = await connectDb();
      const categoriesCollection = db.collection('categories');
      const categories = await categoriesCollection.find().toArray();
      res.status(200).json(categories);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  //Lấy sản phẩm theo id
router.get("/:id", async (req, res, next) => {
  const db = await connectDb();
  const productCollection = db.collection("products");
  const products = await productCollection.findOne({
    _id: new ObjectId(req.params.id),
  });

  const categoryCollection = db.collection("categories");
  const category = await categoryCollection.findOne({
    _id: new ObjectId(products.categoryId),
  });
  products.category = category;
  
  if (products) {
    res.status(200).json(products);
  } else {
    res.status(404).json({ message: "Không tìm thấy" });
  }
});
//Lấy danh sách sản phẩm theo categoryId
router.get("/byCategory/:id", async (req, res, next) => {
  const db = await connectDb();
  const productCollection = db.collection("products");
  const products = await productCollection
    .find({ categoryId: new ObjectId(req.params.id) })
    .toArray();
  if (products) {
    res.status(200).json(products);
  } else {
    res.status(404).json({ message: "Không tìm thấy" });
  }
});
router.get("/topRating", async (req, res, next) => {
  const db = await connectDb();
  const productCollection = db.collection("products");
  const products = await productCollection
    .find()
    .sort({ rating: -1 })
    .limit(10)
    .toArray();
  if (products) {
    res.status(200).json(products);
  } else {
    res.status(404).json({ message: "Không tìm thấy" });
  }
});


module.exports = router;
