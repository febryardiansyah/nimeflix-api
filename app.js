const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const router = require('./routes/index')
const cors = require('cors')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const mongoose = require('mongoose')
const cheerio = require('cheerio');
const { default: axios } = require('axios')

app.use(cors())

mongoose.connect('mongodb+srv://febryar:karangturi123@cluster0.6pime.mongodb.net/nimeflix?retryWrites=true&w=majority',{
    useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false,useCreateIndex:true
}).then(()=>console.log('connected to database'))
.catch(err => console.log(err))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload({createParentPath:true}))

// test
app.use('/test',async(req,res)=>{
    try {
        const response = await axios.get('https://www.blogger.com/video.g?token=AD6v5dycAKMZ3iAxzn6UDTFIm6c_l6Pywh-iZ4_Whn8CJlEzXO7ENH83hqcobF0p1N6sDBd9vzVMwuxOLr7mrS_Ew1ndNDiSQJu724XLKKFo8xA5gCNBWUqY5NMX_T31aXYJptXUWPQw');
        const $ = cheerio.load(response.data);
        console.log($.html());
        res.send('hellow')
    } catch (error) {
        res.send(error);
    }
})

app.use('/api',router)
app.use('/',(req,res)=>{
    res.send({
        message : 'Welcome To Unofficial Otakudesu Rest Api',
        createdBy : 'KaedeNoKi Team ♥️'
    })
})
app.use('/api',(req,res) =>{
    res.send({
        message:'check our github for more info',
        github :'https://github.com/Kaede-No-Ki/otakudesu-rest-api'
    })
})


app.use('*',(req,res) =>{
    res.json({
        'status':'not found path',
        message: 'read the docs here https://github.com/Kaede-No-Ki/otakudesu-rest-api'
    })
})
app.listen(port, () => {
    console.log('listening on port', port)
})