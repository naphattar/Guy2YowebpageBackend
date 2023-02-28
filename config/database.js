const mongoose = require('mongoose');
const dotenv = require('dotenv')

dotenv.config();

const databaseurl = `${process.env.DatabaseURL}`;

exports.connect = () =>{
    // database connecting
    mongoose.connect(databaseurl,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() =>{
        console.log('database connects successfully');
    }).catch((err) =>{
        console.log('database connection error');
        console.error(err);
        process.exit(1);
    });
};