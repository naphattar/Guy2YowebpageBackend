const jwt = require('jsonwebtoken');

const tokenVerify = (req,res,next) =>{
    const token = req.body.token || req.query.token ||req.headers['x-access-token'];
    if(!token){
        return res.status(403).send("Require Token");
    }
    try{
        const decode = jwt.verify(token,process.env.TokenID);
        req.user = decode;
    }catch(err){
        res.status(401).send("Invalid Token");
    }
    return next();
}

module.exports = tokenVerify;