const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	userName: String,
	emailUser: String,
	password: String,                                                    // model de l'utilisateur
	avatar: String,
    expertiseLevel:Object // [{ niveau dans chaque corps de métier}]  ss document expertiselevel
	
	
});

const User = mongoose.model('users', userSchema);

module.exports = User;

