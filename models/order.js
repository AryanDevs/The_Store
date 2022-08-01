const mongoose=require('mongoose')

const orderSchema=new mongoose.Schema({
    shippingInfo:{
        address:{
            type:String,
            required:true
        },
        phoneNo:{
            type:String,
            required:true
        },
        postalCode:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        }
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        req:true

    },
    orderItems:[{
        name:{
            type:String,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
            req:true
        }
    }],
    paymentInfo:{
        
            id:{
                type:String,
                required:true
            }
        
    },
    taxAmount:{
        type:Number,
        required:true
    },
    shippingAmount:{
        type:Number,
        required:true
    },
    totalAmount:{
        type:Number,
        required:true
    },
    orderStatus:{
        type:String,
        default:'processing',
        enum:{
            values:['processing','delivered'],
            message:'Please select from the predefined statuses'
        }
    },
    deliveredAt:{
        type:Date
    },
    createdAt:{
        type:Date,
        defualt:Date.now,
        
    }
})

module.exports=mongoose.model('Order',orderSchema)