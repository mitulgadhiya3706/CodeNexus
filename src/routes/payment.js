const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const User = require("../models/user");
const { membershipAmount } = require("../utils/constant");
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils')

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
        res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
    } catch (err) {
        console.error("Error creating payment:", err);
        return res.status(500).json({ msg: err.message });
    }
});

paymentRouter.get("/payment/webhook", (req, res) => {
    res.send("Webhook route is working");
});

paymentRouter.post("/payment/webhook", async (req, res) => {
    console.log("========== WEBHOOK HIT ==========");
    console.log("Headers:", req.headers);

    try {
        const webhookSignature = req.headers["x-razorpay-signature"];
        console.log("webhook Signature", webhookSignature);

        console.log("Body:", req.body);

        const payload = req.body.toString();
        const isWebhookValid = validateWebhookSignature(
            payload,
            webhookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET
        );

        console.log("Webhook Valid:", isWebhookValid);

        if (!isWebhookValid) {
            console.error("Invalid webhook signature");
            return res.status(401).json({ msg: "Webhook signature is invalid" });
        }

        // //Update payment Status in DB
        // const paymentDetails = req.body.payload.payment.entity;

        const event = JSON.parse(req.body.toString());
        const paymentDetails = event.payload.payment.entity;

        const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
        if (!payment) {
            console.error("Payment not found for orderId:", paymentDetails.order_id);
            return res.status(404).json({ msg: "Payment record not found" });
        }
        payment.status = paymentDetails.status;
        payment.paymentId = paymentDetails.id;
        await payment.save();

        const user = await User.findOne({ _id: payment.userId });
        if (user) {
            user.isPremium = true;
            user.membershipType = payment.notes.membershipType;
            console.log("User saved");
            await user.save();
        }

        // Return 200 OK to acknowledge webhook receipt
        return res.status(200).json({ msg: "Webhook processed successfully" });

    } catch (err) {
        console.error("Webhook error:", err);
        res.status(500).json({ msg: err.message });
    }
})

module.exports = paymentRouter;


