const bcrypt = require('bcryptjs');
const User = require('../models/userschema');

module.exports = {
    async changePass(req, res) {
          console.log("req: ", req.body)
          userToken = req.body.resetToken

          console.log("u: ", userToken.id);
          User.findOne({
            _id: userToken.id
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
                  return res.send({success: true,  msg: 'Password reset successfully' });
                }
    
              });
            });
          });
    
    },

    async changeEmail(req, res) {
      
      userToken = req.body.resetToken

      console.log("u: ", userToken.id);
      User.findOne({
        _id: userToken.id
      }, function (err, userEmail, next) {
        if (!userEmail) {
          return res.send({success: false, msg: 'User does not exist' });
        }
        
          userEmail.email = req.body.email;
          userEmail.save(function (err) {
            if (err) {
              return res.send({success: false,  msg: 'Email can not be reset.' });
            } else {
              return res.send({success: true,  msg: 'Email reset successfully', userData: {
                id: userEmail._id,
                username: userEmail.username,
                email: userEmail.email,
                favoriteLocation: userEmail.favoriteLocation
            }});
            }

          });
        
      });

}

};