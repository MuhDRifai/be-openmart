const express = require('express');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middleware/verifyToken');
const Cart = require('../models/Cart');
const router = express.Router();


// Add To Cart
router.post("/add-to-cart", verifyToken, async (req, res) => {
    try {
      const newCart = new Cart(req.body);
      const savedCart = await newCart.save();
      res.status(200).json(savedCart);
    } catch (err) {
      res.status(500).json({ error: "Failed to add item to cart" });
    }
  });
  
  // Update Cart
  router.put("/update-cart/:id", verifyTokenAndAuthorization, async (req, res) => {
    const cartId = req.params.id;
    const updatedData = req.body;
  
    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        cartId,
        { $set: updatedData },
        { new: true }
      );
  
      if (!updatedCart) {
        return res.status(404).json({ error: "Cart item not found" });
      }
  
      res.status(200).json(updatedCart);
    } catch (err) {
      res.status(500).json({ error: "Failed to update cart item" });
    }
  });
  
// Delete Cart Item
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    const cartId = req.params.id;
  
    try {
      const deletedCart = await Cart.findByIdAndDelete(cartId);
  
      if (!deletedCart) {
        return res.status(404).json({ error: "Cart item not found" });
      }
  
      res.status(200).json({ message: "Cart item has been deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete cart item" });
    }
  });
  
// Get User's Cart Item By User ID
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });

        if (!cart) {
            return res.status(404).json({ error: "User's cart item not found" });
        }

        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve user's cart item" });
    }
});

// Get All Carts
router.get("/get-all-carts", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve carts" });
  }
});

  
  
module.exports = router;
