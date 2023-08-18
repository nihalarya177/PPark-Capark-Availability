const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    },
    favoriteLocation: {
        type: Array
    }, 
    lat:{
        type: Array
    },
    lon:{
        type: Array
    }
});
  



const PetrolSchema = new mongoose.Schema({
    petrol_pump:{
        type: String
    },
    address:{
        type: String
    },
    ammenities:{
        type: String
    },
    postal_code:{
        type: Number
    },
    car_wash:{
        type: Number
    },
    petrol_92:{
        type: Number
    },
    petrol_95:{
        type: Number
    },
    petrol_98:{
        type: Number,
    },
    Premium:{
        type: Number
    },
    Diesel:{
        type: Number
    },
    
})

//const User = module.exports = mongoose.model('User', UserSchema);
const Petrol = module.exports = mongoose.model('sgPetrols', PetrolSchema);
const User = module.exports = mongoose.model('users', UserSchema);

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

module.exports.updateUser = function(id, favoriteLocation1, lat, lon, callback){
    console.log('HELLOO', id, favoriteLocation1, lat, lon);
    try{
    User.updateOne({_id: id}, { $push : {"favoriteLocation": favoriteLocation1, "lat": lat, "lon": lon}}, callback);
}
    catch(e){
        console.log(e);
    }
}

module.exports.deleteFavLocation = function(id, favoriteLocation1, lat, lon, callback){
    console.log('HELLOO', id, favoriteLocation1);
    try{
    User.updateOne({_id: id}, { $pull : {"favoriteLocation": favoriteLocation1, "lat": lat, "lon": lon}}, callback);
}
    catch(e){
        console.log(e);
    }
}

module.exports.getPetrolStations = function(callback){
    Petrol.find({}, callback);
}
