const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	
	name: String,
	email: {type: String, unique: true},
	password: String,                                                    // modèle de l'utilisateur
	avatar: { type: String, default: null},
    skills: {type: mongoose.Schema.Types.ObjectId, ref:'skills', default: null}, // [{ niveau dans chaque corps de métier}]  ss document expertiselevel
	token: String
});

const User = mongoose.model('users', userSchema);

module.exports = User;

