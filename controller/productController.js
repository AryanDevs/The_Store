const Product=require('../models/product')
const cloudinary=require('cloudinary').v2
const multer=require('multer')
const datauri = require('datauri');
const WhereClause = require('../utils/whereCluase')
// const CloudinaryStorage=require('multer-storage-cloudinry')


// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "ecom-products",
//   },
// });


// const upload=multer({dest:'prodims'})
exports.test=async(req,res)=>{
    try{
    let paths=[]
    

    console.log(req.file)
    console.log(req.body)
    paths.push(req.file.filename)

    
    

    console.log(result)
    res.status(200).json({
        success:true,
        localFilePaths:paths,
        message:'Siuuuuu!'
    })
}
catch(error)
{
    res.status(500).json({
        error:error.message
    })
}
}



exports.addProduct=async(req,res)=>{
    try{
        if(!req.files)
        {
            res.status(400).json({
                error:'product images not available'
            })
        }
         let imgArray=[]
        // req.files.forEach(async (element)=>{
        //     try{
        //     console.log(element.path)
        //     const result=await cloudinary.v2.uploader.upload(element.path,{folder:'TheStore Products'})
        //     imgArray.push({
        //         id:result.public_id,
        //         secure_url:result.secure_url
        //     })
       
            
        
        req.body.photos=imgArray
        req.body.user=req.user

        const product=await Product.create(req.body)
        res.status(201).json({
            success:true,
            product
        })
    }
    catch(error){
        res.status(500).send(error.message)
    }
}

exports.getProducts=async(req,res)=>{
    try {
        const productCount=await Product.countDocuments()
        console.log(productCount)
        const productsObject=new WhereClause(Product.find(),req.query).search().filter()

        const resultsPerPage=4
        productsObject.pager(resultsPerPage)
        const products=await productsObject.base

        res.status(200).json({
            success:true,
            products,
            productCount
        })
    } catch (error) {
        
    }
}

exports.adminGetProducts=async(req,res)=>{
    try {
        const products=await Product.find();

        res.status(200).json({
            success:true,
            products
        })
    } catch (error) {
        res.status(500).send(error.message)
    }
}


exports.getOneProduct=async(req,res)=>{
    try {
        const id=req.params.id
        const product=await Product.findById(id)

        if(!product)
        {
            return res.status(400).json({
                error:true,
                message:'No product found'
            })
        }

        res.status(200).json({
            success:true,
            product
        })
    } catch (error) {
        res.status(500).send(error.message)
    }
}


exports.adminUpdateProduct=async(req,res)=>{
    try {
        const id=req.params.id
        const product=await Product.findById(id)
        if(!product)
        {
            return res.status(400).json({
                error:'Product not found'
            })
        }
        console.log('Product was foundd')
        const uproduct=await Product.findByIdAndUpdate(id,req.body,{
            new:true,
            runValidators:true,
            useFindAndModify:false
        })
        console.log('Product updated')
        res.status(200).json({
            success:true,
            message:'Product Updated',
            updatedUser:uproduct
        })
    } catch (error) {
        res.status(500).send(error.message)
    }
}

exports.adminDeleteProduct=async(req,res)=>{
    try{
    const id=req.params.id
    const product=await Product.findById(id)
    if(!product)
    {
        return res.status(400).json({
            error:'Product not found'
        })
    }

    await Product.findByIdAndDelete(id)

    res.status(200).json({
        success:true,
        message:'Product deleted',
        deletedProduct:product
    })
}catch(error){
    res.status(500).json({
        error:error.message
    })
}
}

exports.addReview=async(req,res)=>{
    try {
        const pid=req.params.id
        const product=await Product.findById(pid)

        if(!product)
        {
            res.status(400).json({
                error:'Product not found'
            })
        }

        const review={
            user:req.user._id,
            name:req.user.name,
            rating:Number(req.body.rating),
            comment:req.body.comment
        }

        const alreadyReviewed=product.reviews.find((rev)=>{
            rev.user.toString()==req.user._id.toString()
        })

        

        if(alreadyReviewed)
        {
            console.log('User has alrady reviewed')
            product.reviews.forEach(element => {
                if(element.user.toString()===req.user._id.toString())
                {
                    element.rating=review.rating,
                    element.comment=review.comment
                }
            });
        }
        else{
            product.reviews.push(review)
            product.numberOfReviews=product.reviews.length;
        }

        let rats=product.reviews.reduce((acc,item)=>{
            return acc+item.rating
        },0)

        
        rats=rats/product.reviews.length
        

        product.ratings=rats
        await product.save({validateBeforeSave:false})
        res.status(200).json({
            success:true,
            product
        })

    } catch (error) {
        res.status(500).send(error.message)
    }
}

exports.deleteReview=async(req,res)=>{
    try{
    const {pid}=req.query
    const product=await Product.findById(pid)
    if(!product)
    {
        return res.status(400).json({
            error:'Product not found'
        })
    }

    product.reviews=product.reviews.filter((rev)=>{
        rev.user.toString()===req.user._id.toString()
    })
    product.numberOfReviews=product.reviews.length;

    product.ratings=product.reviews.reduce((acc,rev)=>{
        acc+rev.rating
    },0)/product.reviews.length


    await product.save({validateBeforeSave:false})

    res.status(200).json({
        success:true,
        message:'Review deleted'
    })
    }catch(error){
        res.status(500).json({
            error:error.message
        })
    } 
}

exports.getReviewsForProduct=async(req,res)=>{
    const {pid}=req.query
    try {
        const product=await Product.findById(pid)
        if(!product)
        return res.status(400).json({
            error:'Product not found'
        })

        const revs=product.reviews
        res.status(200).json({
            success:true,
            reviews:revs
        })
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}