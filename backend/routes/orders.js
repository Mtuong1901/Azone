var express = require('express');
var router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
const connectDb = require('../models/db');
/* GET home page. */
router.get('/', async(req, res) => {
    try {
        const db = await connectDb();
        const ordersCollection = db.collection('orders');
        const orders = await ordersCollection.find().toArray();
        res.status(200).json(orders);
      } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
      }
});

router.post('/addorder',async (req,res) =>{
  try {
    const db =connectDb();
    const ordersCollection = (await db).collection('orders');
    const newOrder = req.body;
    const result = await ordersCollection.insertOne(newOrder);
    if (result.insertedId) {
      res.status(200).json({ message: 'Order added successfully', orderId: result.insertedId });
    } else {
      res.status(400).json({ message: 'Failed to add order' });
    }
  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).json({ message: 'Server error' });
  }
})

router.patch('/:id/status', async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    // Kiểm tra tính hợp lệ của ID và trạng thái
    if (!ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    if (!status || !['Processing', 'Delivery', 'Cancel'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const db = await connectDb();
    const ordersCollection = db.collection('orders');

    // Cập nhật trạng thái đơn hàng
    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status } }
    );

    if (result.modifiedCount === 1) {
      res.status(200).json({ message: 'Order status updated successfully' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
