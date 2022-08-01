const express = require("express");
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.sendKeys=async(req,res)=>{
    res.status(200).json({
        success:true,
        publishableKey:process.env.STRIPE_PUBLISHABLE_KEY
    })
}

exports.sendRazorpayKeys=async(req,res)=>{
    res.status(200).json({
        success:true,
        publicKey:process.env.RAZORPAY_KEY
    })
}

exports.captureStripePayment=async(req,res)=>{
    try{
        const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'inr',
        automatic_payment_methods: {enabled: true}})

        res.status(200).json({
            success:true,
            clientSecret:paymentIntent.clientSecret
        })
    }catch(error){

    }
}


exports.captureRazorpayPayment=async(req,res)=>{
    try{
        let instance = new Razorpay({ key_id:process.env.RAZORPAY_KEY, key_secret:RAZORPAY_SECRET})

        const receipt=uuidv4()
        const order=await instance.orders.create({
        amount: req.body.amount,
        currency: "INR",
        receipt: receipt,
    
        })

        res.status(201).json({
            success:true,
            amount:req.body.amount,
            order:order
        })
    }catch(error){
        res.status(500).json({
            error:error.message
        })
    }
}