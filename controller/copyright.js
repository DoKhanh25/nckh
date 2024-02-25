const express = require('express');
const registerCopyrightRouter = express.Router();
const registerCopyrightModel = require('../model/RegisterCopyright.js');
const verifyToken = require('../middleware/verifyToken.js');
const multer = require('multer');
const fs = require('fs')
const path = require('path');
const blockchainGateway = require('../repository/Hyperledger/hyperledgerGateway.js')
const ipfsRepository = require('../repository/IPFS/IPFSRepository.js');
const crypto = require('crypto');
const HyperledgerOptimizeGateWay = require('../repository/Hyperledger/hyperledgerGatewayOptimize.js')

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



// Chức năng lấy thông tin đăng kí bản quyền cá nhân
registerCopyrightRouter.get('/getCopyrightInfo', verifyToken, async (req, res) => {

    let username = req.user;
    await registerCopyrightModel.getCopyrightByUsername(username, async(err, result) => {
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


// chức năng đăng upload tài liệu đăng kí bản quyền
registerCopyrightRouter.post('/uploadFile', verifyToken, type , async (req, res) => {

    let authorAccounts = req.body.authorAccounts;
    let authorIds = req.body.authorIds;
    let registerName = req.body.registerName;
    let title = req.body.title;
    let note = req.body.note;
    let hashFile;
    let filePath;
    let hashCodeArray = []

    
    if(isNullOrEmpty(authorAccounts) || isNullOrEmpty(authorIds) || isNullOrEmpty(registerName) || isNullOrEmpty(title) || isNullOrEmpty(note)){
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

    filePath = path.join(__dirname, '..', '/document-uploads', req.file.filename);
    
    try {
        hashFile = await checksumFile('sha1', filePath);
    } catch (error) {
        hashFile = null;
    }

    let obj = {
        title: title,
        destination: req.file.filename,
        registerName: registerName,
        authorIds: authorIds,
        note: note,
        hash: hashFile
    }
    await registerCopyrightModel.getHashFromPaper(async (err, result) => {
        if(err){
            return res.status(500).json({
                code: 1,
                success: false,
                message: "Lỗi server",
                data: null
            });
        };
        result.forEach((element) => {
            hashCodeArray.push(element.hashCode)
        });

        if(hashCodeArray.includes(obj.hash)){
            return res.status(200).json({
                code: 1,
                success: false,
                message: "Bạn quyền bài này đã được nộp",
                data: null
            });

        };
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
                        message: "Đăng kí thành công",
                        data: null
                    });
                }
            })   
        })
    })

    
})


// Chức năng get thông tin đăng kí bản quyền admin 
registerCopyrightRouter.get('/admin/getAllRegister', verifyToken, async (req, res) => {
    let username = req.user;
    let role = req.role;
    if(role != 2){
        return res.status(500).json({
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
            });        };
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



// Chức năng xem bài đăng kí bản quyền
registerCopyrightRouter.get('/getFile/:id', verifyToken, async (req, res) => {
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
                });            };
            
            let fileName = result[0].path;

            if(!fileName){
                return res.status(200).json({
                    code: 1,
                    success: false,
                    message: "Không có dữ liệu",
                    data: null
                });
            }

            let file = path.join(__dirname, '..', '/document-uploads', fileName );
                res.download(file, function (error) {
                    if(err){
                        if(res.headersSent){
                            console.log(err)
                        } else {
                            return res.sendStatus(500)
                        }
                    }
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

                    let fileName = result[0].path;

                    if(!fileName){
                        return res.status(200).json({
                            code: 1,
                            success: false,
                            message: "Không có dữ liệu",
                            data: null
                        });
                    }
               
                    let file = path.join(__dirname, '..', '/document-uploads', fileName );
                    res.download(file, function (error) {
                        if(err){
                            if(res.headersSent){
                                console.log(err)
                            } else {
                                return res.sendStatus(500)
                            }
                        }
                    }); 

        
                })
            } else {
                return res.status(500).json({
                    code: 1,
                    success: false,
                    message: "Không thuộc sở hữu bài",
                    data: null
                });

            }

        })
    }
})


// chức năng phê duyệt bản quyền
registerCopyrightRouter.post('/admin/acceptCopyright', verifyToken, async (req, res) => {
    let username = req.user;
    let role = req.role;
    let paperId = req.body.id;
    if(role != 2){
        return serverResponse(res, 200, 1, "Bạn không phải admin", null);
    }

    await registerCopyrightModel.getStatusByPaperId(paperId, async (err, result) => {
        if(err){
            return res.status(500).json({
                code: 1,
                success: false,
                message: "Lỗi server",
                data: null
            });
        };
        if(result[0].status == 1){
            return res.status(200).json({
                code: 1,
                success: false,
                message: "Bản quyền đã được duyệt",
                data: null
            });
        } else {
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
                        // Xử lý đưa dữ liệu vào IPFS và Blockchain
                        if(rs){                    
                            try {
                                let filePath = path.join(__dirname, '..', '/document-uploads', rs[0].path);
                                let file = fs.createReadStream(filePath)
        
                                const cid = await ipfsRepository.saveFile(file);
                                
                                let bcAsset = {
                                    assetId: `asset${new Date().getTime()}`,
                                    title: rs[0].title,
                                    hashValue: cid.toString(),
                                    DOI: generateRandomCode(15),
                                    authorName: rs[0].author_identity,
                                    identity: rs[0].author_identity,
                                    acceptBy: username,
                                    updateTime: (new Date()).toISOString(),
                                    updateBy: rs[0].updateBy
        
                                }
                                let hyperledgerGatewayOptimize =  await HyperledgerOptimizeGateWay.getInstance();
                                await hyperledgerGatewayOptimize.connection();

                                await hyperledgerGatewayOptimize.createAsset(bcAsset).then((result) => {
                                    return res.status(200).json({
                                        code: 1,
                                        success: true,
                                        message: "Tạo bản quyền thành công",
                                        data: null
                                    });
                                })
                                .catch(async (err) => {
                                    if(err.code == 10){
                                        await registerCopyrightModel.updataStatusTo0(paperId, (err, result) => {})
                                        return res.status(200).json({
                                            code: 1,
                                            success: false,
                                            message: "Bản quyền đã đăng kí trong hệ thống chung",
                                            data: err.details[0].message
                                        });
                                        
                                    }
                                }).finally(() => {
                                    hyperledgerGatewayOptimize.disconnect()
                                })
        
                            } catch (error) {
                                console.log(error)
                                return res.status(500).json({
                                    code: 1,
                                    success: false,
                                    message: "Lỗi server",
                                    data: null
                                });
                            }
                        }
        
                    })
        
                }
        
            })
        } 
    })
})

function generateRandomCode(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}

function serverResponse(res, status, code, message, success, data){
    return res.status(status).json({
        code: code,
        success: success,
        message: message,
        data: data
    });
}

function serverErrorResponse(req, res, message){
    return res.status(500).json({
        code: 1,
        success: false,
        message: message,
        data: null
    });
}

function checksumFile(hashName, path) {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash(hashName);
      const stream = fs.createReadStream(path);
      stream.on('error', err => reject(err));
      stream.on('data', chunk => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
    });
  }
module.exports = registerCopyrightRouter;