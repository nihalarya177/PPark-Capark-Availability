const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const User = require('../models/user');
const Petrol = require('../models/user');
//const fileContent = fs.readFileSync('/Users/parkhiagarwal/softwareEngg/routes/googlemaps.html');
const config = require('../config/database');
//Register
const ResetPwdController = require('../controllers/passwordReset');
const profController = require('../controllers/changeProfile');


router.post('/getUser', (req, res, next) => {
    console.log(req.body)
    console.log(res.body);
    User.getUserById(req.body, (err, user)=>{
        if(err){
            res.json({success: false, msg: 'Failed to get User'});
        }
        else{
            res.json({success: true, user});
        }
    });
})
router.get('/petrol', (req, res, next) => {
    //res.send('HELLO');
    Petrol.getPetrolStations((err, petrol)=>{
        if(err){
            res.json({success: false, msg: 'Failed to get petrol station'})
        }else{
            res.json({success: true, petrol})
        }
    })

})

//Register
router.post('/register', (req, res, next) => {
    let newUser = new User(
        {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        }
    );
    
    const uName = req.body.username;
    
    User.getUserByUsername(uName, (err, user) => {
        if(err) throw err;
        if(!user){
            User.addUser(newUser, (err, user) => {
                if(err){
                    res.json({success: false, msg: 'Failed to register user'});
                } else{
                    res.json({success: true, msg: 'User registered'});
                }
        
            });
        }else{
            res.json({success: false, msg: 'Username already exists!'}); 
        }
    });

    
})

router.get('/email', (req, res, next) => {
    let email = req.body

    User.addUser(newUser, (err, user) => {
        if(err){
            res.json({success: false, msg: 'Failed to register user'});
        } else{
            res.json({success: true, msg: 'User registered'});
        }

    });

})


//Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg:'User not found!'});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign({user} , config.secret, {
                    expiresIn: 604800 // 1 week
                });

                res.json({
                        success: true,
                        token: 'JWT '+token,
                        user: {
                            id: user._id,
                            username: user.username,
                            email: user.email,
                            favoriteLocation: user.favoriteLocation
                        }
                    });
                
            } else {
                return res.json({success: false, msg: 'Incorrect password'});
            }

        });
    });
});

router.post('/update', (req, res, next) => {
    console.log(req.body);
    const favoriteLocation = req.body.favoriteLocation;
    const lat = req.body.lat;
    const lon = req.body.lon;
    User.updateUser(req.body[0], req.body[1], req.body[2], req.body[3], (err, user)=>{
        if(err){
            res.json({success: false, msg: 'Failed to update user'});
        } else{             
            console.log(user);

            res.json({success: true, msg: 'User updated'});           

        }

    });
})

router.post('/updateDelete', (req, res, next)=> {
    console.log(req.body);
    const favoriteLocation = req.body.favoriteLocation;
    console.log(favoriteLocation);
    User.deleteFavLocation(req.body[0], req.body[1], req.body[2], req.body[3], (err, user)=>{
        if(err){
            res.json({success: false, msg: 'Failed to update user'});
        } else{             
            console.log(user);

            res.json({success: true, msg: 'User updated'});           

        }

    });
})

//Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    return res.json({user: req.user});
});

//Validate
router.get('/validate', (req, res, next) => {
    res.send('Validate');
});


//GetUser

router.post('/req-reset-password', ResetPwdController.ResetPassword);

router.post('/new-password', ResetPwdController.NewPassword);

router.post('/valid-password-token', ResetPwdController.ValidPasswordToken);

router.post('/change-pass', profController.changePass);

router.post('/change-email', profController.changeEmail);

module.exports = router;



