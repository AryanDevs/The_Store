const { json, response } = require('express')
const User=require('../models/user')
const jwt=require('jsonwebtoken')
const cookieParser = require('cookie-parser')


exports.loggedin=async(req,res,next)=>{
    try{
    const token=req.cookies.token||req.header['Authorization'].toString().split(' ')[1]||req.body.token
    if(!token)
    res.status(401).json({
        error:'Need to be logged in'
    })
    
    const val=jwt.verify(token,process.env.JWT_SECRET)
    if(!val)
    res.status(401).json({
        error:'Authentication failed'
    })

    req.user=await User.findById(val.id)
    next()
    }
    catch(error)
    {
        res.send(error)
    }

}

exports.customeRole=(...roles)=>{
    return (req,res,next)=>{
        
        if(!roles.includes(req.user.role)){
            return res.status(400).json({
                error:true,
                message:'Not allowed to access this feature'
            })
        }

        next()
    }
}

