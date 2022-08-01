
const app=require('./app')
const path=require('path')
const configpath=path.join(__dirname,'./config/.env')
console.log(configpath)
require('dotenv').config({path:configpath})

const PORT=process.env.PORT

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})