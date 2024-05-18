const mongoose = require('mongoose');

const artisanSchema = mongoose.Schema({

	email: String,
	phone: Number,
	field: String,												// domaine d'expertise
	company: String,
	availability: Date,                                         // modèle de l'artisan
	trustLevel: Number,											
	quote: Number,											//	devis
	comment: String,
	
});

const Artisan = mongoose.model('artisans', artisanSchema);

module.exports = Artisan;
