const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;
const authRouter = require('./controller/auth.js')
const accountInfoRouter = require('./controller/accountInfo.js')
const copyrightRouter = require('./controller/copyright.js')



require('dotenv').config();



app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use('/api/auth', authRouter )
app.use('/api/v1', accountInfoRouter)
app.use('/api/v1/', copyrightRouter)

app.listen(PORT, ()=> {
    console.log(`Server is listening port ${PORT}`);
})