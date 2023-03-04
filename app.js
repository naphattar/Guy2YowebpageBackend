const express = require('express');
const dotenv =  require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./config/database');
const cors = require('cors');
const bodyParser = require("body-parser");
const User = require('./model/user');
const auth = require('./middleware/auth');

dotenv.config();
db.connect();

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended : true}));

const corsOptions = {
    origin: 'guy2yowebpage.vercel.app',
    credentials: true,
};

app.use(cors(corsOptions));
//

app.get('/',(req,res) =>{
    res.send("Server is working ... ");
});

app.get('/users' , async(req,res) =>{
    try{
        // get all user data
        const allUsers = await User.find({});
        if(allUsers){
            res.status(201).json(allUsers);
        }else{
            res.status(400).send("No users");
        }

    }catch(err){
        console.log(err);
    }
});

app.post('/register',async(req,res) =>{
    try{
        const {username,password} = req.body;
        if(!(username && password)){
            res.status(401).send("Please Enter Username and Password");
            return;
        }
        const oldUser = await User.findOne({username});
        if(oldUser){
            res.status(402).send("This Username already exist");
            return;
        }
        encryptPassword = await bcrypt.hash(password,10);

        const newUser = await User.create({
            username: username,
            password: encryptPassword
        });

        const token = jwt.sign(
            {
                user_id: newUser._id,
                username
            },
            process.env.TokenID,{
                expiresIn: "2h"
            }
        )

        newUser.token = token;
        res.status(201).json(newUser);
    }catch(err){
        console.log(err);
    }
});

app.post('/login' ,async(req,res) =>{
    try{

        const {username,password} = req.body;
        if(!(username && password)){
            res.status(400).send("Please Enter Username and Password");
            return;
        }

        const user = await User.findOne({username});
        if(user && await bcrypt.compare(password,user.password)){
            const token = jwt.sign(
                {
                    user_id: user._id,
                    username
                },
                process.env.TokenID,{
                    expiresIn: "2h"
                }
            )
    
            user.token = token;
            res.status(201).json(user);
        }else{
            res.status(401).send("Login Failed");
        }
    }catch(err){
        console.log(err);
    }
});

app.post('/welcome',auth,(req,res) =>{
    res.status(200).send("Welcome");
});

app.put('/updateuserscore',async(req,res)=>{
    try{
        const {username,newscore} = req.body;
        const oldUser = await User.findOne({username});
        if(newscore >= oldUser.highscore){
            await oldUser.updateOne({
                $set: {highscore: newscore}
            });
        }
        const updatedUser = await User.findOne({username});
        res.status(201).send(updatedUser);
    }catch(err){
        console.log(err);
    }
});


module.exports = app;