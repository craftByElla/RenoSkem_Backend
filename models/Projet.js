const mongoose = require('mongoose');

const projetSchema = mongoose.Schema({                                 // model du projet
	emailUser:String,
	projetName: String,
	budget: Number,
    picture: String,
	localisation: String,  
    roomProjet: [Object]     // [{cle etrangere sur la collection room }]

});

const Projet = mongoose.model('projets', projetSchema);

module.exports = Projet;

