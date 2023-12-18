const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;
const authRouter = require('./controller/auth.js')
require('dotenv').config();



  

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.json());




app.use('/api/auth', authRouter )

app.listen(PORT, ()=> {
    console.log(`Server is listening port ${PORT}`);
})