const mongoose=require('mongoose')
const user = require('./user')

const productSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide name'],
        maxlength:[120]
    },
    price:{
        type:Number,
        required:[true,'Please provide rice'],
        maxlength:[6]
    },
    description:{
        type:String,
        required:[true,'Please provide product description']
    },
    photots:{
        id:{
            type:String,
            required:false
        },
        secure_url:{
            type:String,
            required:false
        }
    },
    category:{
        type:String,
        required:[true,'Please select category'],
        enum:{
            values:['shortsleeve','longsleeve','hoodie'],
            message:'Please select wthin the given category only'
        }
    },
    brand:{
        type:String,
        required:[true,'Please add a brand for product']
    },
    stock:{
        type:Number,
        required:[true,'Please provide the available stock']
    },
    ratings:{
        type:Number,
        default:0
    },
    numberOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        name:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            required:true
        },
        comment:{
            type:String
        }
    }
    ],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('Product',productSchema)