const mongoose=require('mongoose')
mongoose.connect("mongodb+srv://aryan:lcostore@cluster0.eqfekyl.mongodb.net/thestore?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology:true
})