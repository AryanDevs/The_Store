const express=require('express')
const router=express.Router()

//Importng controllers
const {signup,login,logout,forgotpassword,resetpassword,dashboard,updatepassword,updateuser,adminAllUser,managerAllusers,adminGetUser,adminUpdateUser,adminDeleteUser}=require('../controller/userController')



//Importing middleware
const { loggedin,customeRole } = require('../middleware/loggedin')


router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/forgotpassword').post(forgotpassword)
router.route('/password/reset/:ftoken').post(resetpassword)
router.route('/userdashboard').get(loggedin,dashboard)
router.route('/updatepassword').post(loggedin,updatepassword)
router.route('/userdashboard/update').post(loggedin,updateuser)


router.route('/admin/users').get(loggedin,customeRole('Admin'),adminAllUser)
router.route('/admin/users/:id').get(loggedin,customeRole('Admin'),adminGetUser)
.put(loggedin,customeRole('Admin'),adminUpdateUser)
.delete(loggedin,customeRole('Admin'),adminDeleteUser)



router.route('/manager/users').get(loggedin,customeRole('Manager'),managerAllusers)
module.exports=router