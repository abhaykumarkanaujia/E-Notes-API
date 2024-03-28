const jwt = require('jsonwebtoken');

const fetchuser = (req, res, next)=>{
    const token = req.header('token');
    if(!token){
        res.status(401).send({error: "Access Denied!! Please LogIn with a Valid Id."});
    }else{
        try{
            const userData = jwt.verify(token, "thesecretiswaytoosecret");
            req.user = userData.user;
        }catch(err){
            console.log(err);
            res.status(401).send({error: "Access Denied!! Please LogIn with a Valid Id."});
        }
    }
    next();
}


module.exports = fetchuser;