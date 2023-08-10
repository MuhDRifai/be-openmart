const express = require('express');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middleware/verifyToken');
const Order = require('../models/Order');
const router = express.Router();


// Add Order
router.post("/add-order", verifyToken, async (req, res) => {
    try {
      const newOrder = new Order(req.body);
      const savedOrder = await newOrder.save();
      res.status(200).json(savedOrder);
    } catch (err) {
      res.status(500).json({ error: "Failed to add order" });
    }
  });  
  
 // Update Order
router.put("/update-order/:id", verifyTokenAndAdmin, async (req, res) => {
    const orderId = req.params.id;
    const updatedData = req.body;
  
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { $set: updatedData },
        { new: true }
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
  
      res.status(200).json(updatedOrder);
    } catch (err) {
      res.status(500).json({ error: "Failed to update order" });
    }
  });  
  
// Delete Order
router.delete("/delete-order/:id", verifyTokenAndAdmin, async (req, res) => {
    const orderId = req.params.id;
  
    try {
      const deletedOrder = await Order.findByIdAndDelete(orderId);
  
      if (!deletedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
  
      res.status(200).json({ message: "Order has been deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete order" });
    }
  });
  
  
// Get User's Orders By User ID
router.get("/get-user-orders/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
      const orders = await Order.findOne({ userId: req.params.userId });
  
      if (!orders) {
        return res.status(404).json({ error: "User's orders not found" });
      }
  
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json({ error: "Failed to retrieve user's orders" });
    }
  });
  
  // Get All Orders
router.get("/get-all-orders", verifyTokenAndAdmin, async (req, res) => {
    try {
      const orders = await Order.find();
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json({ error: "Failed to retrieve orders" });
    }
  });

// GET Monthly Income
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
    
    try {
      const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
        { $sort: { _id: 1 } } // Sort by month in ascending order
      ]);
      
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

module.exports = router;
