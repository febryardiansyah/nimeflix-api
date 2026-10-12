const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const router = require('./routes/index')
const cors = require('cors')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const mongoose = require('mongoose')

app.use(cors())

mongoose.connect('mongodb+srv://febryar:karangturi123@cluster0.6pime.mongodb.net/nimeflix?retryWrites=true&w=majority',{
    useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false,useCreateIndex:true
}).then(()=>console.log('connected to database'))
.catch(err => console.log(err))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload({createParentPath:true}))

app.use('/api',router)
app.get('/',(req,res)=>{
    res.status(200).json({
        success: true,
        message: 'Welcome To Unofficial Otakudesu Rest Api',
        data: {
            created_by: 'KaedeNoKi Team ♥️'
        }
    })
})
app.use('/api',(req,res) =>{
    res.status(200).json({
        success: true,
        message: 'check our github for more info',
        data: {
            github: 'https://github.com/Kaede-No-Ki/otakudesu-rest-api'
        }
    })
})


app.use((req,res) =>{
    res.status(404).json({
        success: false,
        message: 'Not found path, read the docs here https://github.com/Kaede-No-Ki/otakudesu-rest-api',
        data: null
    })
})
app.listen(port, () => {
    console.log('listening on port', port)
})