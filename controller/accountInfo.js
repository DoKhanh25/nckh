const express = require('express');
const accountInfoRouter = express.Router();
const jwt = require('jsonwebtoken');
const userModel = require('../model/User.js')
const verifyToken = require('../middleware/verifyToken.js')
const infoModel = require('../model/Info.js')


//thêm thông tin tài khoản 
accountInfoRouter.post('/:id/add',verifyToken,async(req,res)=>{
    let fullname = req.body.username
    let email = req.body.email
    let birthday = new Date(req.body.birthday)
    let job = req.body.job
    let organization = req.body.organization
    let address = req.body.address
    let avatar = req.body.avatar


    if(!fullname || !email || !birthday || !job || !organization || !address || !avatar){
        return res.status(200).json({
            code: 3,
            success: false,
            message: "Bạn nhập thiếu thông tin",
            data: null
        })
    }
    await userModel.createUser_info(fullname, email, birthday, job, organization, address, avatar, async(err,result)=>{
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
    });
})
//Sửa thông tin   
accountInfoRouter.put('/:id/edit',verifyToken,async(req,res)=>{
    let userId = req.body.Id
    let fullname = req.body.username
    let email = req.body.email
    let birthday = new Date(req.body.birthday)
    let job = req.body.job
    let organization = req.body.organization
    let address = req.body.address
    let avatar = req.body.avatar

    if(fullname){
        await userModel.updateUser_fullname(fullname, userId, async(err, result) => {
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
                message: "Cập nhật fullname thành công",
                data: "ok"
        });
        })
    }
    if(email){
        await userModel.updateUser_email(email, userId, async(err, result) => {
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
                message: "Cập nhật email thành công",
                data: "ok"
        });
        })
    }
    if(birthday){
        await userModel.updateUser_birthday(birthday, userId, async(err, result) => {
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
                message: "Cập nhật birthday thành công",
                data: "ok"
        });
        })
    }
    if(job){
        await userModel.updateUser_job(job, userId, async(err, result) => {
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
                message: "Cập nhật job thành công",
                data: "ok"
        });
        })
    }
    if(organization){
        await userModel.updateUser_organization(organization, userId, async(err, result) => {
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
                message: "Cập nhật organization thành công",
                data: "ok"
        });
        })
    }
    if(address){
        await userModel.updateUser_address(address, userId, async(err, result) => {
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
                message: "Cập nhật address thành công",
                data: "ok"
        });
        })
    }
    if(avatar){
        await userModel.updateUser_avatar(avatar, userId, async(err, result) => {
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
                message: "Cập nhật avatar thành công",
                data: "ok"
        });
        })
    }
   
})

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


accountInfoRouter.post('/info', verifyToken, async(req, res) => {
    let username = req.user;
    let { fullname, email, birthday, job, organization, address, avatar} = req.body;
    let obj = req.body;
    obj.username = username;

    if(!username || !fullname || !email || !birthday || !job || !organization || !address){
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