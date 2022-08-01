const express=require('express')

const router=express.Router()

const {loggedin,customeRole}=require('../middleware/loggedin')

const {sendKeys,sendRazorpayKeys}=require('../controller/paymentController')

router.route('/stripeKeys').get(loggedin,sendKeys)
router.route('/razorpayKeys').get(loggedin,sendRazorpayKeys)

module.exports=router