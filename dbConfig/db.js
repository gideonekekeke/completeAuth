const mongoose = require('mongoose')
const url_offline = "mongodb://localhost/CompleteAuthDB"
mongoose.connect(url_offline).then(()=>{
    console.log('connecred successfully')
}).catch((err)=>{
    console.log('connection to database failed')
})