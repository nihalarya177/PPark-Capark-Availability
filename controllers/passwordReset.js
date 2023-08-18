const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/userschema');
const passwordResetToken = require('../models/tokenSchema');

module.exports = {

    async ResetPassword(req, res) {
        
        const user = await User.findOne({
        email:req.body.email
        });

        if (!user) {
            return res.json({success: false, msg: 'Email does not exist' });
        }
        var resettoken = new passwordResetToken({ _userId: user._id, resettoken: crypto.randomBytes(16).toString('hex') });
        resettoken.save(function (err) {
        if (err) { 
            return res.send({ success: false, msg: err.message }); 
        }

        passwordResetToken.find({ _userId: user._id, resettoken: { $ne: resettoken.resettoken } }).deleteOne().exec();
        res.status(200).json({success: true, msg: 'Reset Password successfully.' });
        
        var transporter = nodemailer.createTransport({
          service: 'Gmail',
          port: 465,
          auth: {
            user: 'ppark246813579@gmail.com',
            pass: 'Ppark$123'
          }
        });
        var mailOptions = {
        to: user.email,
        from: 'ppark246813579@gmail.com',
        subject: ' Password Reset ',
        text: 'You are receiving this because you have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://localhost:4200/reset-password/' + resettoken.resettoken + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        }
        transporter.sendMail(mailOptions, (err, info) => {
        })
        })
    },

    async ValidPasswordToken(req, res) {
        if (!req.body.resettoken) {
            return res.send({success: false,  msg: 'Token is required' });
        }

        const user = await passwordResetToken.findOne({
        resettoken: req.body.resettoken

        });
        if (!user) {
            return res.send({succes: false,  msg: 'Invalid URL' });
        }
        User.findOneAndUpdate({ _id: user._userId }).then(() => {
            res.status(200).json({success: true, msg: 'Token verified successfully.' });
        }).catch((err) => {
            return res.status(500).send({ msg: err.message });
        });
    },

    async NewPassword(req, res) {
        passwordResetToken.findOne({ resettoken: req.body.resetToken }, function (err, userToken, next) {
          //console.log("r: ",resettoken);
          console.log("u: ",userToken);
          if (!userToken) {
            return res.send({ success: false, msg: 'Token has expired' });
          }
    
          User.findOne({
            _id: userToken._userId
          }, function (err, userEmail, next) {
            if (!userEmail) {
              return res.send({success: false, msg: 'User does not exist' });
            }
            return bcrypt.hash(req.body.password, 10, (err, hash) => {
              if (err) {
                return res.send({success: false, msg: 'Error hashing password, Please try again' });
              }
              userEmail.password = hash;
              userEmail.save(function (err) {
                if (err) {
                  return res.send({succes: false,  msg: 'Password can not reset.' });
                } else {
                  userToken.deleteOne();
                  return res.send({success: true,  msg: 'Password reset successfully' });
                }
    
              });
            });
          });
    
        })
    }


}