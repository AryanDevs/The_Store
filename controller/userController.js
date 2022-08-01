const User=require('../models/user')
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const {loggedin}=require('../middleware/loggedin')
const cloudinary=require('cloudinary')
const mailer = require('../utils/mails')




exports.signup=async(req,res)=>{
    try {
        const {name,email,password}=req.body
        if(!email || !name || !password)
        return res.status(400).json({
            error:'Please enter all the required values'
        })
        let result;
        // if(req.files)
        // {
        //     const img=req.files.photo
        //      result=await cloudinary.v2.uploader.upload(img.tempFilePath,
        //         {
        //             folder:'ecom-users',
        //             width:150,
        //             crop:'scale'
        //         }
        //     );
        // }

         

        
        const user=await User.create({name:name,email:email,password:password,})
        console.log('User created')
        const token=user.tokenize()
        const options={
            expires:new Date(
                Date.now()+ 2*24*60*60*1000
            ),
            httpOnly:true
        }
        console.log('Token set')


        return res.status(201).cookie("token",token,options).json({
            success:true,
            user,
            token

        })
    } catch (error) {
        res.status(500).json({
            error:error
        })
    }
    
}
exports.login=async(req,res)=>{
    const {email,password}=req.body
    if(! email || ! password)
    res.status(400).json({
        error:'Please provide name and password'
    })

    try {
        const user=await User.findOne({email:email}).select("+password")
        if(!user)
        res.staus(400).json({error:'User not found'})

        console.log('User found!')
        const val=await user.isValidPassword(password)
        
        if(val===false)
        return res.status(400).json({error:'Incorrect username or password'})

        console.log('Password is valid')
        const token=user.tokenize()
        console.log(token)
        const options={
            expires:new Date(
                Date.now()+ 2*24*60*60*1000
            ),
            httpOnly:true
        }

        res.status(200).cookie("token",token,options).json({
            success:'Logged in',
            user,
            token:token
        })

    } catch (error) {
        
    }
}


exports.logout=async(req,res)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true

    })
    res.status(200).json({
        success:true,
        message:'Logged out successfully'
    })
}

// photo:{
//             id:result.public_id,
//             secure_url:result.secure_url
//         }

exports.forgotpassword=async(req,res)=>{
    const email=req.body.email;
    const user=await User.findOne({email:email})

    if(!user)
    res.status(400).json({
        error:'Invalid email'
    })

    const ftoken=await user.forgotPassword()
    console.log(ftoken)
    user.save({validateBeforeSave:false})

    const forgotUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${ftoken}`
    const msg=`Hi ${user.name}!\nWe received your request to reset your password\nCopy and paste this link in the browser \n\n${forgotUrl}`
    try {
        const options={
            to:email,
            subject:"The Store--Reset Password",
            text:msg
        }

        await mailer(options)
        res.status(200).json({
            success:true,
            message:'Link to change password has been sent on email'
        })
    } catch (error) {
        user.forgotPasswordToken=undefined
        user.resetPasswordExpiry=undefined
        user.save({validateBeforeSave:false})

        res.status(500).json({
            error:error.message
        })
    }
}

exports.resetpassword=async(req,res)=>{
    try{
    const ftoken=req.params.ftoken
    console.log('The token received is ',ftoken)
    const user=await User.findOne({forgotPasswordToken:ftoken,resetPasswordExpiry:{$gt:Date.now()}}).select('+password')
    
    if(!user)
    res.status(400).json({
        error:'Token is no longer valid'
    })
    console.log('Found the user within expiry time',user)
    const newpass=req.body.newpass
    const same=await user.isValidPassword(newpass)
    if(same)
    res.status(400).json({
        error:'The new and the old password must be different'
    })

    console.log('Setting new password')
    user.password=newpass
    user.forgotPasswordToken=false
    user.resetPasswordExpiry=false
    await user.save()
    res.status(200).json({
        success:true,
        message:'Password reset successful',
        user
    })
    }catch(error){
        res.status(500).json({
            error:true,
            message:error.message
        })
    }
    
    

}

exports.dashboard=async(req,res)=>{
    try {
        const user=req.user
        res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

exports.updatepassword=async (req,res)=>{
    try {
        const id=req.user._id
        const user=await User.findById(id).select('+password')
        const oldpass=req.body.oldpass
        const newpass=req.body.newpass
        const oldcorrect=await user.isValidPassword(oldpass)

        if(!oldcorrect)
        return res.status(400).json({
            error:'Invalid old password'
        })

        user.password=newpass
        await user.save()

        res.status(200).json({
            success:true,
            message:'Password updated'
        })
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

exports.updateuser=async(req,res)=>{
    try{
    const user=req.user
    const newData={
        name:req.body.name,
        email:req.body.email

    }

    const updatedUser=await User.findByIdAndUpdate(user._id,newData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    const token= updatedUser.tokenize()
    return res.status(200).cookie('token',token,{
        httpOnly:true,
        expires:new Date(
                Date.now()+ 2*24*60*60*1000
            )
    }).json({
        success:true,
        updatedUser,
        token
    })
    }catch(error){
        res.status(500).json({
            error:error.message
        })
    }
}

exports.adminAllUser=async(req,res)=>{
    const users=await User.find()
    res.status(200).json({
        success:true,
        Users:users
    })
}

exports.managerAllusers=async(req,res)=>{
    const users=await User.find({role:'user'})
    res.status(200).json({
        success:true,
        Users:users
    })
}

exports.adminGetUser=async(req,res)=>{
    try {
        const id=req.params.id
        const user=await User.findById(id)
        if(!user)
        {
            return res.status(200).json({
                result:'User not found'
            })
        }
        res.status(200).json({
            result:'User found',
            USer:user
        })
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

exports.adminUpdateUser=async(req,res)=>{
    try {
        const id=req.params.id
        const {email,name,role}=req.body
        const user=await User.findById(id)

        if(!user)
        {
            res.status(400).jsom({
                message:'User not found'
            })
        }

        const nuser=await User.findByIdAndUpdate(id,{
            name,
            email,
            role
        },{new:true,runValidators:true,useFindAndModify:false})

        res.status(200).json({
            success:true,
            message:'Record updated',
            updatedUser:nuser
        })

    } catch (error) {
        res.status(500).send(error)
    }
}

exports.adminDeleteUser=async(req,res)=>{
    try {
        const id=req.params.id
        const user=await User.findById(id)
        if(!user)
        {
            res.status(400).json({
                error:'User not found'
            })
        }
        await user.remove()
        res.status(200).json({
            success:true,
            message:'Record deleted'
        })
    } catch (error) {
         res.status(500).json({
            success:false,
            message:error.mesage
        })
    }
}