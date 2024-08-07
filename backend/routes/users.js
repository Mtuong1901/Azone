const express = require('express');
const router = express.Router();
const connectDb = require('../models/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const { ObjectId } = require('mongodb');

// Cấu hình multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Bạn chỉ được upload file ảnh'));
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Khóa bí mật cho JWT
const secretKey = process.env.SECRET_KEY || 'yourSecretKey';
// GET tất cả người dùng
router.get('/', async (req, res) => {
  try {
    const db = await connectDb();
    const userCollection = db.collection('users');
    const users = await userCollection.find().toArray();
    res.status(200).json(users);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

// POST đăng nhập
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = await connectDb();
    const userCollection = db.collection('users');
    const user = await userCollection.findOne({ email });

    if (user && password === user.password) {
      const token = jwt.sign(
        { email: user.email, image: user.image, username: user.username, role: user.role },
        secretKey,
        { expiresIn: '1h' }
      );

      // Lưu token vào cookie
      res.cookie('token', token, {
        httpOnly: true,  // Chỉ cho phép cookie được truy cập bởi web server
        secure: process.env.NODE_ENV === 'production', // Chỉ gửi cookie qua HTTPS khi ở chế độ production
        maxAge: 3600000  // Thời gian sống của cookie, ở đây là 1 giờ
      });

      return res.status(200).json({ message: 'Đăng nhập thành công', token, user });
    } else {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
});

// POST đăng ký
router.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const db = await connectDb();
    const userCollection = db.collection('users');

    const existingUser = await userCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email đã tồn tại' });
    }
    const newUser = {
      email,
      password,
      username,
      role: 'cus',
    };

    const result = await userCollection.insertOne(newUser);
    res.status(201).json({ message: 'Người dùng đã được đăng ký thành công', result });
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
});

// Middleware xác thực token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); // Không được phép

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403); // Cấm truy cập
    req.user = user;
    next();
  });
}

// GET route bảo mật
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Xác thực thành công' });
});

// GET khách hàng
router.get('/customers', async (req, res) => {
  try {
    const db = await connectDb();
    const userCollection = db.collection('users');
    const users = await userCollection.find({ role: 'cus' }).toArray();
    res.status(200).json(users);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khách hàng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});
router.get('/admin', async (req, res) => {
  try {
    const db = await connectDb();
    const userCollection = db.collection('users');
    const users = await userCollection.find({ role: 'admin' }).toArray();
    res.status(200).json(users);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khách hàng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

// POST thêm khách hàng
router.post('/addcustomer', upload.single('image'), async (req, res) => {
  try {
    const db = await connectDb();
    const customerCollection = db.collection('users');

    const { username, email, phone } = req.body;
    const image = req.file ? req.file.filename : null;

    // Kiểm tra xem email đã tồn tại chưa
    const existingCustomer = await customerCollection.findOne({ email });

    if (existingCustomer) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    const newCustomer = { username, email, phone, image, role: 'cus' };
    const result = await customerCollection.insertOne(newCustomer);

    if (result.insertedId) {
      res.status(200).json({ message: 'Khách hàng đã được thêm thành công' });
    } else {
      res.status(500).json({ message: 'Thêm khách hàng không thành công' });
    }
  } catch (error) {
    console.error('Lỗi khi thêm khách hàng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
});

// DELETE khách hàng
router.delete('/deleteCustomer/:id', async (req, res) => {
  try {
    const db = await connectDb();
    const customerCollection = db.collection('users');
    const id = new ObjectId(req.params.id);

    const result = await customerCollection.deleteOne({ _id: id });
    if (result.deletedCount) {
      res.status(200).json({ message: 'Khách hàng đã được xóa thành công' });
    } else {
      res.status(404).json({ message: 'Khách hàng không tìm thấy' });
    }
  } catch (error) {
    console.error('Lỗi khi xóa khách hàng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
});
// router.get('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!ObjectId.isValid(id)) {
//       return res.status(400).json({ message: 'ID không hợp lệ' });
//     }

//     const db = await connectDb();
//     const userCollection = db.collection('users');
//     const user = await userCollection.findOne({ _id: new ObjectId(id) });

//     if (user) {
//       res.status(200).json(user);
//     } else {
//       res.status(404).json({ message: 'Không tìm thấy người dùng' });
//     }
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     res.status(500).json({ message: 'Lỗi server' });
//   }
// });

router.put('/updatecustomer/:id', upload.single('image'), async (req, res, next) => {
  const db = await connectDb();
  const usersCollection = db.collection('users');
  const id = new ObjectId(req.params.id);
  const { username, email, phone } = req.body;
  let updatedCustomer = { username, email,phone }; 

  if (req.file) {
    const image = req.file.originalname;
    updatedCustomer.image = image; //
  }

  try {
    const result = await usersCollection.updateOne({ _id: id }, { $set: updatedCustomer });
    if (result.matchedCount) {
      res.status(200).json({ message: "Sửa khach hang thanh cong" });
    } else {
      res.status(404).json({ message: "Không tìm thấy khach hang" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại" });
  }
});
router.put('/updateadmin/:id', upload.single('image'), async (req, res) => {
  try {
    const db = await connectDb();
    const usersCollection = db.collection('users');

    // Kiểm tra tính hợp lệ của ID
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    const id = new ObjectId(req.params.id);
    const { username, email, phone } = req.body;
    let updatedAdmin = { username, email, phone };

    if (req.file) {
      const image = req.file.originalname;
      updatedAdmin.image = image;
    }

    const result = await usersCollection.updateOne({ _id: id }, { $set: updatedAdmin });

    if (result.matchedCount > 0) {
      res.status(200).json({ message: 'Sửa admin thành công' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy admin với ID đã cung cấp' });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật admin:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại' });
  }
});
module.exports = router;
