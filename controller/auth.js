const express = require('express');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
const userModel = require('../model/User.js')
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
const argon2 = require('argon2');
const verifyAccessToken = require('../middleware/verifyToken.js');
const user = require('../model/User.js');
//regex kiểm tra password có 1 in hoa, 1 thường, số và 8 ký tự


require('dotenv').config();



// register
authRouter.post('/register', async (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    if(!username || !password){
        return res.status(200).json({
            code: 3,
            success: false,
            message: "Bạn nhập thiếu tài khoản hoặc mật khẩu",
            data: null
        });
    }

    if(!PASSWORD_REGEX.test(password)){
        return res.status(200).json({
            code: 3,
            success: false,
            message: "Mật khẩu không đúng yêu cầu",
            data: null
        });
    }

    await userModel.findUser(username, async (err, result) => {
        if(err){
            console.log(err)
            return res.status(500).json({
                code: 1,
                success: false,
                message: "Lỗi server",
                data: null
            });
        }
        if(result[0]){
            return res.status(200).json({
                code: 3,
                success: false,
                message: "Tài khoản đã tồn tại",
                data: null
            });
        }
        await userModel.createUser(username, password, (err, result) => {
            if(err){
                return res.status(500).json({
                    code: 1,
                    success: false,
                    message: "Lỗi server",
                    data: null
                });
            }
            return res.status(200).json({
                code: 0,
                success: true,
                message: "Đăng kí thành công",
                token: jwt.sign({username: username, role: 1}, process.env.JWT_PRIVATE_RAW),
                data: {username: username, role: 1}
            });
        })
    })
    
    
})

authRouter.post('/login', async (req, res, next ) => {
    let username = req.body.username;
    let password = req.body.password;

    if(!username || !password){
        return res.status(200).json({
            code: 3,
            success: false,
            message: "Bạn nhập thiếu tài khoản hoặc mật khẩu",
            data: null
        });
    }
    await userModel.findUser(username, async (err, result) => {
        if(err){
            return res.status(500).json({
                code: 1,
                success: false,
                message: "Lỗi server",
                data: null
            });
        }
        if(!result[0]){
            return res.status(200).json({
                code: 3,
                success: false,
                message: "Không tồn tại tài khoản",
                data: null
            });
        }
        await userModel.findPassword(username, async (err, result) => {
            if(err){
                return res.status(500).json({
                    code: 1,
                    success: false,
                    message: "Lỗi server",
                    data: null
                });
            }
         
            if(await argon2.verify(result[0].password, password)){
                return res.status(200).json({
                    code: 0,
                    success: true,
                    message: "Đăng nhập thành công",
                    token: jwt.sign({username: username, role: result[0].role}, process.env.JWT_PRIVATE_RAW),
                    data: {username: username, role: result[0].role}
                });
            } else {
                return res.status(200).json({
                    code: 3,
                    success: false,
                    message: "Sai tài khoản hoặc mật khẩu",
                    data: null
                });
            }
        })
    })
})

authRouter.post('/changePassword', verifyAccessToken, async (req, res) => {
    let username = req.user;
    let currentPassword = req.body.currentPassword;
    let newPassword = req.body.newPassword;

    if(!currentPassword || !newPassword){
        return res.status(200).json({
            code: 3,
            success: false,
            message: "Bạn nhập thiếu thông tin",
            data: null
        });
    }

    if(!PASSWORD_REGEX.test(newPassword)){
        return res.status(200).json({
            code: 3,
            success: false,
            message: "Mật khẩu mới không đúng yêu cầu",
            data: null
        });
    }
    
    await userModel.findPassword(username, async (err, result) => {
        if(err){
            return res.status(500).json({
                code: 1,
                success: false,
                message: "Lỗi server",
                data: null
            });
        }
        if(await argon2.verify(result[0].password, currentPassword) == false){
            return res.status(200).json({
                code: 3,
                success: true,
                message: "Mật khẩu không chính xác",
                data: null
            });
        }
        await userModel.changePassword(req.body, username, async (err, result) => {
            if(err){
                return res.status(500).json({
                    code: 1,
                    success: false,
                    message: "Lỗi server",
                    data: null
                });  
            }
            return res.status(200).json({
                code: 0,
                success: true,
                message: "Thay đổi mật khẩu thành công",
                data: null
            });
            
        })

    })
})

module.exports = authRouter