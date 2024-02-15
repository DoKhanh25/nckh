const express = require('express');
const registerCopyrightRouter = express.Router();
const registerCopyrightModel = require('../model/RegisterCopyright.js');
const verifyToken = require('../middleware/verifyToken.js');
const multer = require('multer');


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
            message: "Bạn chưa nhập file",
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
        destination: req.file.destination,
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
        console.log(result)
    
        return res.status(200).json({
                code: 0,
                success: true,
                message: "",
                data: "ok"
        });
    })

    
})

module.exports = registerCopyrightRouter;