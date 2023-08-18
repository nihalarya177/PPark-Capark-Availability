const mongoose = require('mongoose');


const resettokenSchema = new mongoose.Schema({
_userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
resettoken: { type: String, required: true },
createdAt: { type: Date, required: true, default: Date.now, expires: 604800 },
});


module.exports = mongoose.model('passwordResetToken', resettokenSchema);