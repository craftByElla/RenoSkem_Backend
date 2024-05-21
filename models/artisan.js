const mongoose = require('mongoose');

const artisanSchema = mongoose.Schema({

	email: String,
	phone: Number,
	field: { type: String, enum: [
		"Chauffage",
		"Cloisonnement/Plâtrage",
		"Démolition",
		"Électricité",
		"Étanchéité",
		"Façade",
		"Fondations",
		"Installation cuisine/SDB",
		"Isolation",
		"Maçonnerie",
		"Menuiserie",
		"Montage de meuble",
		"Peinture",
		"Plomberie",
		"Revêtements muraux",
		"Revêtements sol",
		"Revêtements extérieurs",
		"Toiture",
		"Ventilation"
	] },												// domaine d'expertise
	company: String,
	availability: { type: Date, default: null },               
	trustLevel: { type: Number, enum: [1, 2, 3], default: null }, 											
	quote: { type: Number, default: null }, 											//	devis
	comment: { type: String, default: null } 
	
});

const Artisan = mongoose.model('artisans', artisanSchema);

module.exports = Artisan;
