const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const config = require('../config/database');
  
const UserSchema = new mongoose.Schema({
    
    username : {
        type: String,
        required: true,
        lowercase: true
    },
    email : {
        type: String,
        required: true,
        lowercase: true
    },
    password : {
        type: String,
        required: true
    },
    createdat: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    updatedat: {
        type: Date,
        default: () => Date.now()
    }
});
  
const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByEmail = function(email_id, callback){
    const query = ({email: email_id })
    User.findOne(query, callback);
}

module.exports.getUserByUsername = function(username, callback){
    const query = {username: username }
    User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(10, (err, salt) =>{
        bcrypt.hash(newUser.password, salt, (err, hash) => {
           if(err) throw err;
           newUser.password = hash;
           newUser.save(callback) 
        });
    });
    
}

module.exports.comparePassword = function(keyedPassword, hash, callback){
    bcrypt.compare(keyedPassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
    
}