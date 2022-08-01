const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide a name'],
        maxLength:[40,'Name should not exceed 40 characters']

    },
    email:{
        type:String,
        validate:[validator.isEmail,'Please provide correct email'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'Please provide a password'],
        minLength:[5,'Password must contain a minimum of 5 characters'],
        select:false
    },
    role:{
        type:String,
        default:'user'
    },
    photo:{
        
        id:{
            type:String
        },
        secure_url:{
            type:String
        }
    },
    forgotPasswordToken:String,
    resetPasswordExpiry:String,
    createdAt:{
        type:Date,
        default:Date.now
    }

})

userSchema.pre('save',async function(next){
    if(!this.isModified('password'))
    return next()

    this.password=await bcrypt.hash(this.password,10)
    next()
})


userSchema.methods.isValidPassword=async function(sentPass){
    const actual=this.password
    return await bcrypt.compare(sentPass,actual)
    
}

userSchema.methods.tokenize= function(){
    const token= jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRY})
    
    options={
        httpOnly:true
    }
    return token
}
userSchema.methods.forgotPassword=async function(){
    const forgottoken=crypto.randomBytes(20).toString('hex')

    this.forgotPasswordToken=forgottoken
    this.resetPasswordExpiry=Date.now()+60*60*1000
    return forgottoken;
}
module.exports=mongoose.model('User',userSchema)