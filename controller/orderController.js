const Order=require('../models/order')
const Product=require('../models/product')

exports.createOrder=async(req,res)=>{
    try {
        const {shippingInfo,
        orderItems,
        paymentInfo,
        taxAmount,
        shippingAmount,
        totalAmount,
        }=req.body

        const order=await Order.create({shippingInfo,
        orderItems,
        paymentInfo,
        taxAmount,
        shippingAmount,
        totalAmount,
        user:req.user._id
        })

        res.status(201).json({
            success:true,
            message:'Order created successfully',
            order:order
        })
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

exports.findOrder=async(req,res)=>{
    try {
        const oid=req.params.id
        const order=await Order.findOne({_id:oid,user:req.user._id}).populate("user","name email")

        if(!order){
            return res.status(400).json({
                message:'Could not find that order with the user'
            })
        }

        res.status(200).json({
            success:true,
            message:"Order found",
            order:order
        })
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}


exports.findOrders=async(req,res)=>{
    try {
        
        const orders=await Order.find({user:req.user._id}).populate("user","name email")

        if(orders.length==0){
            return res.status(400).json({
                message:'Could not find that order with the user'
            })
        }

        res.status(200).json({
            success:true,
            message:"Orders found",
            orders:orders
        })
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

exports.allOrders=async(req,res)=>{
    try {
        const orders=await Order.find()
        res.status(200).json({
            success:true,
            orders
        })
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

exports.updateorder=async(req,res)=>{
    try{
    const oid=req.params.oid
    const order=await Order.findById(oid)
    if(!order)
    {
        return res.status(400).json({
            error:'No such product found'
        })
    }
    
    if(order.orderStatus==='delivered')
    {
        return res.status(400).json({
            message:"Order already marked delivered!"
        })
    }
    
    const ostatus=req.body.ostatus
    order.orderStatus=ostatus
    
    order.orderItems.forEach(async(oi)=>{
        await updateStock(oi.product,oi.quantity)
    })
    
    await order.save();

    res.status(200).json({
        success:true,
        message:'Order successfully updated',
        order
    })
    }catch(error){
        res.status(500).json({
            error:error.message
        })
    }

}

exports.deleteorder=async(req,res)=>{
    try {
        const oid=req.params.oid
        await Order.findByIdAndDelete(oid)
        res.status(200).json({
            success:true,
            message:'Order deleted successfully'
        })
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

const updateStock=async(productID,quantity)=>{
    
        const product=await Product.findById(productID)
        product.stock=product.stock-quantity
        await product.save({validateBeforeSave:false})
    
}