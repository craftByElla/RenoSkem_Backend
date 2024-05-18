const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	
	name: String,
	email: String,
	password: String,                                                    // modèle de l'utilisateur
	avatar: {type: String, default: null},
    skills: {type: mongoose.Schema.Types.ObjectId, ref:'skills'} // [{ niveau dans chaque corps de métier}]  ss document expertiselevel
	
});

const User = mongoose.model('users', userSchema);

module.exports = User;

