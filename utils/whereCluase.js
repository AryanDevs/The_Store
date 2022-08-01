
// base=Product.find()

const { json } = require("express")


class WhereClause{
    constructor(base,bigQ){
        this.base=base
        this.bigQ=bigQ
    }

    search(){
        const searchword=this.bigQ.search?{
            name:{
                $regex:this.bigQ.search,
                $options:'i'
            }
        }:{}
        
        this.base=this.base.find({...searchword})
        return this
    }

    filter()
    {
        let copyQ={...this.bigQ}
        delete copyQ['search']
        delete copyQ['page']
        delete copyQ['limit']

        let stringCopyQ=JSON.stringify(copyQ)

        stringCopyQ.replace(/\b(gte|lte|gt|lt)\b/g,
        m=>`$${m}`)

        const jsonCopyQ=JSON.parse(stringCopyQ)
        this.base=this.base.find(jsonCopyQ)
        return this
    }

    pager(resultsPerPage)
    {
        let curPage=1
        if(this.bigQ.page)
        {
            curPage=this.bigQ.page
        }

        const skipVal=resultsPerPage*(curPage-1)
        this.base=this.base.limit(resultsPerPage).skip(skipVal)
        

        return this
    }
}

module.exports=WhereClause