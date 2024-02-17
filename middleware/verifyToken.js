const jwt = require('jsonwebtoken');

const verifyAccessToken =  (req, res, next) =>{
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
        return res.status(401).json({
            code: 1,
            success: false,
            message: "Token không hợp lệ",
            data: null
        })
    };
    try {
        const decode = jwt.verify(token, process.env.JWT_PRIVATE_RAW);
    
        req.user = decode.username;
        req.role = decode.role;
        next()
    } catch (error) {
        console.log(error);
        res.status(405).json({
            success: false,
            message: "Invalid token"
        })
    }

}

module.exports = verifyAccessToken;