const express=require('express')
require('dotenv').config({path:'./config/.env'})
const morgan=require('morgan')
const cookieparser=require('cookie-parser')
const fileupload=require('express-fileupload')
const bodyParser = require('body-parser');
const formidable=require('formidable')
const multer=require('multer')
// const upload=multer()
require('./db/connection')
// require('./utils/cloudinary')
cloudinary=require('cloudinary')

const app=express()


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.CLOUDINARY_URL 
});

//regular middleware

app.use(express.json())
app.use(express.urlencoded({extended:true}))
// app.use(fileupload({
//   useTempFiles:true,
//   tempFileDir:'/temp/'
// }))
// app.use(upload.array())
// app.use(formidable())
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended:true}))

//Files and cookie middleware
app.use(cookieparser())
// app.use(fileupload())

//Importing all routes
const home=require('./routes/home')
const user=require('./routes/user')
const product=require('./routes/product')
const payment=require('./routes/payments')
const order = require('./routes/order')
//Morgan middleware
app.use(morgan('tiny'))

//Route middleware
app.use('/api/v1',home)
app.use('/api/v1',user)
app.use('/api/v1',product)
app.use('/api/v1',payment)
app.use('/api/v1',order)

// const upload=multer({dest:'./prodims'})
// app.post('/api/v1/multertest',upload.single('photo'),async(req,res)=>{
//   console.log(req.body)
//   console.log(req.file)
//   res.status(200).send('Siuuuu')
// })
module.exports=app