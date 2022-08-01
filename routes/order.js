const express=require('express')

const router=express.Router()

const {loggedin,customeRole}=require('../middleware/loggedin')
const {createOrder,findOrder,findOrders,allOrders,updateorder,deleteorder}=require('../controller/orderController')


router.route('/order/create').post(loggedin,createOrder)
router.route('/order/myorders').get(loggedin,findOrders)
router.route('/order/find/:id').get(loggedin,findOrder)

//Admin routes
router.route('/order/admin/update/:oid').put(loggedin,customeRole('Admin'),updateorder)
router.route('/order/admin').get(loggedin,customeRole('Admin'),allOrders)
router.route('/order/admin/delete/:oid').delete(loggedin,customeRole('Admin'),deleteorder)

module.exports=router
