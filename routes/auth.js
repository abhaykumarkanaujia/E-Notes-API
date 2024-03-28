const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middlewares/fetchuser');


const router = express.Router();

router.post('/addUser', [body('email').isEmail().withMessage("Not Valid"),
                    body('password').isLength({min : 5}).withMessage("Too Small"),
                    body('name').isLength({min : 1}).withMessage("Field Required")],
 async (req, res)=>{
    try{
        const result = validationResult(req);
        if(!result.isEmpty()){
            res.json(result);
        }
        else{
            const user = await User.findOne({email : req.body.email});
            if(user){
                res.status(400).json({success: false, error: "User Already Exists!!"});
            }else{
                const salt = await bcrypt.genSalt();
                const pass = await bcrypt.hash(req.body.password, salt);
                await User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: pass
                }).then(user => res.json({success: true, token:jwt.sign(data = {user:{id: user.id}}, "thesecretiswaytoosecret")})
                     )
                .catch(err => console.log(err));
            }
            
        }
    }catch(err){
        console.log("Errors: " + err);
        res.status(500).json({error: "Faulty Server!!"});
    }
});


router.post('/login', [body('email').isEmail().withMessage("Not a Valid Email"),
                    body('password').isLength({min : 1}).withMessage("Password field Can't be Empty.")],
 async (req, res)=>{
    try{
        const result = validationResult(req);
        if(!result.isEmpty()){
            res.json(result);
        }
        else{
            const user = await User.findOne({email : req.body.email});
            if(!user){
                res.status(400).json({success:false, error: "Invlaid Credentials!!"});
            }else{
                const result = await bcrypt.compare(req.body.password, user.password)
                if(!result){
                    res.status(400).json({error: "Invlaid Credentials!!"});
                }else{
                    res.json({success: true, token:jwt.sign(data = {user:{id: user.id}}, "thesecretiswaytoosecret")});
                }
            }
        }
    }catch(err){
        console.log("Errors: " + err);
        res.status(500).json({success: false, error: "Internal Server Error!!! Contact Your IT Admin!!"});
    }
});


router.post("/getUser", fetchuser, async (req, res)=>{
    try{
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json(user);
    }catch(err){
        console.log(err);
    }
});

module.exports = router;