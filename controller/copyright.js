const express = require('express');
const registerCopyrightRouter = express.Router();
const registerCopyrightModel = require('../model/RegisterCopyright.js');
const verifyToken = require('../middleware/verifyToken.js');
const multer = require('multer');
const fs = require('fs')
const path = require('path');
const blockchainGateway = require('../repository/Hyperledger/hyperledgerGateway.js')
const ipfsRepository = require('../repository/IPFS/IPFSRepository.js')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname +  '/../document-uploads');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + file.originalname
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
const upload = multer({ storage: storage});
const type = upload.single('file');

registerCopyrightRouter.get('/getCopyrightInfo', verifyToken, async (req, res) => {
    let username = req.user;
    console.log(username);
    await registerCopyrightModel.getCopyrightByUsername(username, async(err, result )=> {
        if(err){
            return res.status(500).json({
                code: 1,
                success: false,
                message: "Lỗi server",
                data: null
            });
        };
        if(result){
            return res.status(200).json({
                code: 1,
                success: true,
                message: "Thành công",
                data: result
            });
        }
    } ) 
})



registerCopyrightRouter.post('/uploadFile', verifyToken, type , async (req, res) => {

    let authorAccounts = req.body.authorAccounts;
    let authorIds = req.body.authorIds;
    let registerName = req.body.registerName;
    let title = req.body.title;
    let note = req.body.note;
    
    if(!authorAccounts || !authorIds || !registerName || !title || !note){
        return res.status(200).json({
            code: 3,
            success: false,
            message: "Bạn chưa nhập thông tin",
            data: null
        });
    }
    if(!req.file){
        return res.status(200).json({
            code: 3,
            success: false,
            message: "Bạn chưa nhập file",
            data: null
        });
    }
    let obj = {
        title: title,
        destination: req.file.filename,
        registerName: registerName,
        authorIds: authorIds,
        note: note
    }
    await registerCopyrightModel.createRegisterCopyright(obj, async (err, result) => {
        if(err){
            return res.status(500).json({
                code: 1,
                success: false,
                message: "Lỗi server",
                data: null
            });
        }

        let paperId = result.insertId; 
        
        await registerCopyrightModel.insertDataToPaper_PK(authorAccounts.split(','), paperId, async (err, rs) => {
            if(err){
                return res.status(500).json({
                    code: 1,
                    success: false,
                    message: "Lỗi server",
                    data: null
                });
            }
            if(rs){
                return res.status(200).json({
                    code: 1,
                    success: true,
                    message: "Đăng kí thành công, vui lòng đợi xét duyệt",
                    data: "OK"
                });
            }
        })

    
        
    })

    
})


registerCopyrightRouter.get('/admin/getAllRegister', verifyToken, async (req, res) => {
    let username = req.user;
    let role = req.role;
    if(role != 2){
        return res.status(200).json({
            code: 1,
            success: false,
            message: "Bạn không phải admin",
            data: null
        });
    }

    await registerCopyrightModel.getAllCopyright(async (err, result ) => {
        if(err){
            return res.status(500).json({
                code: 1,
                success: false,
                message: "Lỗi server",
                data: null
            });
        };
        if(result){
            return res.status(200).json({
                code: 1,
                success: true,
                message: "Thành công",
                data: result
            });
        }
    })
})

registerCopyrightRouter.get('/getFile/:id', verifyToken, async (req, res) => {
    console.log(req.params.id);
    let fileId = req.params.id;
    let role = req.role;
    let username = req.user;

    if(role == 2){
        await registerCopyrightModel.getDownloadFilePath(fileId, async (err, result) => {
            if(err){
                return res.status(500).json({
                    code: 1,
                    success: false,
                    message: "Lỗi server",
                    data: null
                });
            };

            console.log(result);
            
            let fileName = result[0].hashcode;
            if(!fileName){
                return res.status(200).json({
                    code: 1,
                    success: false,
                    message: "Không dữ liệu",
                    data: null
                });
            }
            let file = path.join(__dirname, '..', '/document-uploads', fileName );
                    res.download(file, function (error) {
                        console.log("Error : ", error)
            }); 
        })
    } else {
        await registerCopyrightModel.getPaperIdByUsername(username, async (err, result) => {
            if(err){
                return res.status(500).json({
                    code: 1,
                    success: false,
                    message: "Lỗi server",
                    data: null
                });
            };

            let idList = [];

            result.forEach(element => {
                idList.push(element.paper_id.toString());
            });


            if(idList.includes(fileId)){
                await registerCopyrightModel.getDownloadFilePath(fileId, async (err, result) => {
                    if(err){
                        return res.status(500).json({
                            code: 1,
                            success: false,
                            message: "Lỗi server",
                            data: null
                        });
                    };

                    let fileName = result[0].hashcode;
                    if(!fileName){
                        return res.status(200).json({
                            code: 1,
                            success: false,
                            message: "Không dữ liệu",
                            data: null
                        });
                    }
               
                    let file = path.join(__dirname, '..', '/document-uploads', fileName );
                    res.download(file, function (error) {
                        console.log("Error : ", error)
                    }); 

        
                })
            }

        })
    }
})

registerCopyrightRouter.post('/admin/acceptCopyright', verifyToken, async (req, res) => {
    let username = req.user;
    let role = req.role;
    let paperId = req.body.id;
    if(role != 2){
        return res.status(200).json({
            code: 1,
            success: false,
            message: "Bạn không phải admin",
            data: null
        });
    }

    await registerCopyrightModel.updateStatus(paperId, async (err, result) => {
        if(err){
            return res.status(500).json({
                code: 1,
                success: false,
                message: "Lỗi server",
                data: null
            });
        }

        if(result){

            await registerCopyrightModel.getPaperByID(paperId, async(err, rs) => {
                if(err){
                    return res.status(500).json({
                        code: 1,
                        success: false,
                        message: "Lỗi server",
                        data: null
                    });
                };
                if(rs){
                    const assetValue = rs[0];
                    
                }
            })
            // handle insert into blockchain and IPFS

        }

    })


})

module.exports = registerCopyrightRouter;