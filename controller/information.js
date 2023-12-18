const express = require('express');
const infoRouter = express.Router();
const jwt = require('jsonwebtoken');
const userModel = require('../model/User.js')
const argon2 = require('argon2');
const verifyToken = require('../middleware/verifyToken.js')
const info = require('../model/Info.js')



infoRouter.get('/info', verifyToken, async (req, res) => {
    let username = req.body.username;
    await info.getInformation(username, async (err, result) => {
        if(err){
            return res.status(500).json({
                code: 1,
                success: false,
                message: "Lỗi server",
                data: null
            });
        }
        if(result[0]){
            return res.status(200).json({
                code: 0,
                success: true,
                message: "Có thông tin",
                data: result[0]
            });
        }
        else {
            return res.status(200).json({
                code: 3,
                success: false,
                message: "Chưa có thông tin",
                data: null
            }); 
        }
    })
})

infoRouter.post('/info', verifyToken, async (req, res) => {
    
    let obj = req.body;
    obj.birthday = new Date(obj.birthday);
    await info.createAuthorInformation(obj, async (err, result) => {
        if(err){
            return res.status(500).json({
                code: 1,
                success: false,
                message: "Lỗi server",
                data: null
            });
        }
        console.log(result)
    
        return res.status(200).json({
                code: 0,
                success: true,
                message: "",
                data: "ok"
        });
        
       
    })

})