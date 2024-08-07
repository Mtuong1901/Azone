var express = require('express');
var router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
const connectDb = require('../models/db');
const multer = require('multer');
//Thiết lập nơi lưu trữ và tên file
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
function checkFileUpLoad(req, file, cb){
  if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
    return cb(new Error('Bạn chỉ được upload file ảnh'));
  }
  cb(null, true);
  }
  //Upload file
  let upload = multer({ storage: storage, fileFilter: checkFileUpLoad });
  
// Endpoint GET để lấy danh sách sản phẩm
router.get('/', async (req, res) => {
  try {
      const db = await connectDb();
      const productsCollection = db.collection('products');
      const categoryCollection = db.collection('categories');

      const products = await productsCollection.find().toArray();

      // Sử dụng Promise.all để lấy tên danh mục cho từng sản phẩm
      const productsWithCategory = await Promise.all(products.map(async (product) => {
          const category = await categoryCollection.findOne({
              _id: new ObjectId(product.categoryId),
          });
          return {
              ...product,
              category: category ? category.name : 'Unknown',
          };
      }));

      res.status(200).json(productsWithCategory);
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
  router.get('/category/:id', async (req, res) => {
    const { id } = req.params; // Lấy ID từ tham số của URL
  
    try {
      const db = await connectDb();
      const categoriesCollection = db.collection('categories');
      const category = await categoriesCollection.findOne({ _id: new ObjectId(id) });
  
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ message: 'Danh mục không tìm thấy' });
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
  });
  
  router.post('/addCategory', upload.single('image'), async (req, res) => {
    try {
      const db = await connectDb();
      const categoriesCollection = db.collection('categories');
      const newCategory = req.body;
      
      if (req.file) {
        newCategory.image = req.file.filename; // Cập nhật đường dẫn hình ảnh vào danh mục
      }
      
      const result = await categoriesCollection.insertOne(newCategory);
  
      if (result.insertedId) {
        res.status(201).json({ message: 'Thêm danh mục thành công', category: { _id: result.insertedId, ...newCategory } });
      } else {
        res.status(500).json({ message: 'Thêm danh mục không thành công' });
      }
    } catch (error) {
      console.error('Error adding category:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  router.delete('/deleteCategory/:id', async (req, res, next) => {
    const db = await connectDb();
    const categoriesCollection = db.collection('categories');
    const id = new ObjectId(req.params.id);
    try {
      const result = await categoriesCollection.deleteOne({ _id: id });
      if (result.deletedCount) {
        res.status(200).json({ message: "Xóa danh muc thành công" });
      } else {
        res.status(404).json({ message: "Không tìm thấy danh muc" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại" });
    }
  });
  router.put('/updateCategory/:id', upload.single('image'), async (req, res, next) => {
    const db = await connectDb();
    const categoryCollection = db.collection('categories');
    const id = new ObjectId(req.params.id);
    const { name } = req.body;
    let updatedCategory = { name}; 
  
    if (req.file) {
      const image = req.file.originalname;
      updatedCategory.image = image; 
    }
  
    try {
      const result = await categoryCollection.updateOne({ _id: id }, { $set: updatedCategory });
      if (result.matchedCount) {
        res.status(200).json({ message: "Sửa danh muc thành công" });
      } else {
        res.status(404).json({ message: "Không tìm thấy danh muc" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại" });
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

router.get('/search/:keyword', async (req, res) => {
  try {
    const db = await connectDb();
    const productCollection = db.collection('products');
    const products = await productCollection.find({ name: new RegExp(req.params.keyword, 'i') }).toArray();

    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
  } catch (error) {
    console.error('Lỗi khi tìm kiếm sản phẩm từ cơ sở dữ liệu:', error);
    res.status(500).json({ message: "Lỗi server" });
  }
});
router.post('/addproduct', upload.single('image'), async (req, res, next) => {
  const db = await connectDb();
  const productCollection = db.collection('products');
  const { name, price, description, categoryId } = req.body;
  const image = req.file.originalname;
  const newProduct = { name, price, description, categoryId, image };
  try {
    const result = await productCollection.insertOne(newProduct);
    // Check if insertedId exists (indicates successful insertion)
    if (result.insertedId) {
      res.status(200).json({ message: "Thêm sản phẩm thành công" });
    } else {
      res.status(500).json({ message: "Thêm sản phẩm thất bại" }); // Consider using 500 for unexpected errors
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại" }); // Generic error message for user
  }
});
//Xóa sản phẩm
router.delete('/deleteproduct/:id', async (req, res, next) => {
  const db = await connectDb();
  const productCollection = db.collection('products');
  const id = new ObjectId(req.params.id);
  try {
    const result = await productCollection.deleteOne({ _id: id });
    if (result.deletedCount) {
      res.status(200).json({ message: "Xóa sản phẩm thành công" });
    } else {
      res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại" });
  }
});

//Sửa sản phẩm
router.put('/updateproduct/:id', upload.single('image'), async (req, res, next) => {
  const db = await connectDb();
  const productCollection = db.collection('products');
  const id = new ObjectId(req.params.id);
  const { name, price, description, categoryId } = req.body;
  let updatedProduct = { name, price, description, categoryId }; 

  if (req.file) {
    const image = req.file.originalname;
    updatedProduct.image = image; //
  }

  try {
    const result = await productCollection.updateOne({ _id: id }, { $set: updatedProduct });
    if (result.matchedCount) {
      res.status(200).json({ message: "Sửa sản phẩm thành công" });
    } else {
      res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại" });
  }
});


module.exports = router;
