const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constant");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
    try {

        const order = await razorpayInstance.orders.create({
            "amount": membershipAmount[req.body.membershipType] * 100,
            "currency": "INR",
            receipt: "receipt#1",
            notes: {
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                membershipType: req.body.membershipType,
            },
        });

        //save it in my DB
        const payment = new Payment({
            userId: req.user._id,
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes,
        })
        const savedPayment = await payment.save();
        //return back my order details to frontend
        res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID});
    } catch (err) {
        console.error("Error creating payment:", err);
        return res.status(500).json({ msg: err.message });
    }
});


module.exports = paymentRouter;