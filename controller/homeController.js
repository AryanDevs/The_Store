exports.home=(req,res)=>{
    res.status(200).json({
        success:true,
        greeting:'Welcome from controller',
        createdat:new Date
    })
}

exports.homeDummy=(req,res)=>{
    res.status(200).json({
        success:true,
        greeting:'This is just a dummy route',
        createdat:new Date
    })
}