const mongoose = require('mongoose');                                // model de la room

const itemSchema = mongoose.Schema({                                 
	                                     
	id: { type: String, required: true },
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
	], required: true },															// à quel dommaine appartient le travaux
	difficulty: {type: Number, enum: [1, 2, 3], required: true},
	diy: {type: Boolean, default: true, required: true},
	artisan: {type: mongoose.Schema.Types.ObjectId, ref:'artisan', default: null},         //[{ cle etrangere sur la collection team}]
	teammates: {type: [{type: mongoose.Schema.Types.ObjectId, ref:'teammates'}], default: []},         //[{ cle etrangere sur la collection team}]         

});




const roomSchema = mongoose.Schema({                                 
	 
	type: { type: String, enum: [
		"Balcon",
		"Buanderie",
		"Bureau",
		"Cave",
		"Chambre",
		"Cuisine",
		"Entrée",
		"Garage",
		"Grenier/Combles",
		"Jardin",
		"Salle à manger",
		"Salle de bain",
	], required: true}, 
	name: { type: String, default: null },
    items: { type: [itemSchema], default: [] },  // [{name:String, level: Number, DIYorPRO: Boolean }, inserer d'autre objets si plusieurs poste de travaux ] 
    surface: { type: Number, default: null },
    comment: { type: String, default: ' ' },
	project: { type: mongoose.Schema.Types.ObjectId, ref:'project', default: null }
});

const Room = mongoose.model('rooms', roomSchema);

module.exports = Room;

