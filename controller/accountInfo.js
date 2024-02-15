const express = require('express');
const accountInfoRouter = express.Router();
const jwt = require('jsonwebtoken');
const userModel = require('../model/User.js')
const verifyToken = require('../middleware/verifyToken.js')
const infoModel = require('../model/Info.js')



// Khanh
accountInfoRouter.get('/info', verifyToken, async (req, res) => {
    let username = req.user;
    await infoModel.getInformation(username, async (err, result) => {
        if(err){
            return res.status(500).json({
                code: 1,
                success: false,
                message: "Lỗi server",
                data: null
            });
        }
        if(result[0]){
            console.log(result[0])
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

accountInfoRouter.get('/allInfo', verifyToken ,async (req, res) => {
    await infoModel.getAllInformation(async (err, result) => {
        if(err){
            return res.status(500).json({
                code: 1,
                success: false,
                message: "Lỗi server",
                data: null
            });
        }
        if(result[0]){
            console.log(result[0])
            return res.status(200).json({
                code: 0,
                success: true,
                message: "Có thông tin",
                data: result
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

accountInfoRouter.post('/info', verifyToken, async(req, res) => {
    let username = req.user;
    let { fullname, email, birthday, job, organization, address, avatar} = req.body;
    let obj = req.body;
    obj.username = username;

    if(!username || !fullname || !email || !birthday || !job || !organization || !address || !avatar){
        return res.status(200).json({
            code: 3,
            success: false,
            message: "Bạn nhập thiếu thông tin",
            data: null
        })
    }
    await infoModel.createAuthorInformation(obj, async(err, result)=> {
        if(err){
            console.log(err)
            return res.status(500).json({
                code: 1,
                success: false,
                message: "Lỗi server",
                data: null
            })
        }
        console.log(result[0]);
        
        return res.status(200).json({
            code: 0,
            success: true,
            message: "Tạo thành công",
            data: "ok"
    });
    }) 
})

accountInfoRouter.put('/info', verifyToken, async(req, res) => {
    let { fullname, email, birthday, job, organization, address, avatar} = req.body;
    let username = req.user;
    let obj = req.body;

    if(!username || !fullname || !email || !birthday || !job || !organization || !address){
        return res.status(200).json({
            code: 3,
            success: false,
            message: "Bạn nhập thiếu thông tin",
            data: null
        })
    }
    await infoModel.updateInfo(obj, username, async(err, result)=> {
        if(err){
            return res.status(500).json({
                code: 1,
                success: false,
                message: "Lỗi server",
                data: null
            })
        }
        return res.status(200).json({
            code: 0,
            success: true,
            message: "Cập nhật thành công",
            data: "ok"
    });
    }) 
})


//test
module.exports = accountInfoRouter