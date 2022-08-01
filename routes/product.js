const express=require('express')
const multer=require('multer')




const router=express.Router()
//auth middleware
const{loggedin,customeRole}=require('../middleware/loggedin')


// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "test",
//   },
// });
// const storage=multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,'../prodims/')
//     },

// })
// const upload=multer({
//     dest:'prodims'
// })


// if (!fs.existsSync("./uploads")) {
//     fs.mkdirSync("./uploads");
// }

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "./uploads");
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     },
// });



var upload = multer({ dest: 'prodims' });


// async function uploadToCloudinary(locaFilePath) {
  
//     // locaFilePath: path of image which was just
//     // uploaded to "uploads" folder
  
//     var mainFolderName = "main";
//     // filePathOnCloudinary: path of image we want
//     // to set when it is uploaded to cloudinary
//     var filePathOnCloudinary = 
//         mainFolderName + "/" + locaFilePath;
  
//     return cloudinary.uploader
//         .upload(locaFilePath, { public_id: filePathOnCloudinary })
//         .then((result) => {
  
//             // Image has been successfully uploaded on
//             // cloudinary So we dont need local image 
//             // file anymore
//             // Remove file from local uploads folder
//             fs.unlinkSync(locaFilePath);
  
//             return {
//                 message: "Success",
//                 url: result.url,
//             };
//         })
//         .catch((error) => {
  
//             // Remove file from local uploads folder
//             fs.unlinkSync(locaFilePath);
//             return { message: "Fail" };
//         });
// }



const{test,addProduct,getProducts,adminGetProducts,getOneProduct,adminUpdateProduct,adminDeleteProduct,addReview,deleteReview,getReviewsForProduct}=require('../controller/productController');
const { get } = require('mongoose');

//Test routes
router.route('/product').post(upload.single('photo'),test)

//User Rouer
router.route('/products').get(getProducts)
router.route('/products/:id').get(getOneProduct)

router.route('/products/review/:id').put(loggedin,addReview)
router.route('/products/review').delete(loggedin,deleteReview)
router.route('/products/review').get(loggedin,getReviewsForProduct)

//Admin roles
router.route('/admin/product/add').post(loggedin,customeRole('Admin'),upload.array('photos',2),addProduct)
router.route('/admin/products').get(loggedin,customeRole('Admin'),adminGetProducts)
router.route('/admin/product/update/:id').post(loggedin,customeRole('Admin'),adminUpdateProduct)
router.route('/admin/product/delete/:id').delete(loggedin,customeRole('Admin'),adminDeleteProduct)

module.exports=router