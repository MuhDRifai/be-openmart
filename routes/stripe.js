const router = require("express").Router();
const stripe = require('stripe')(process.env.STRIPE_KEY);

router.post("/payment", async (req, res) => {
    try {
        const stripeResponse = await stripe.charges.create({
            source: req.body.tokenId,
            amount: req.body.amount,
            currency: "IDR",
        });

        res.status(200).json(stripeResponse);
    } catch (error) {
        res.status(500).json({
            error: {
                message: error.message,
                code: error.code
            }
        });
    }
});

module.exports = router;
