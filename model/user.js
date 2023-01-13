const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type:String ,default : null},
    password: {type: String , default : null},
    highscore: {type: Number , default : 0},
    token: {type: String}
})

module.exports = mongoose.model('user',userSchema);