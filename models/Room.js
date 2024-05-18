const mongoose = require('mongoose');                                // model de la room

const itemSchema = mongoose.Schema({                                 
	                                     
	field: String, 																// à quel dommaine appartient le travaux
	difficulty: Number, 
	diy: Boolean,
	artisan: {type: mongoose.Schema.Types.ObjectId, ref:'artisan'},         //[{ cle etrangere sur la collection team}]
	teammates: [{type: mongoose.Schema.Types.ObjectId, ref:'teammates'}],         //[{ cle etrangere sur la collection team}]         

});




const roomSchema = mongoose.Schema({                                 
	 
	type: String,
	name: String,
    items: [itemSchema],   // [{name:String, level: Number, DIYorPRO: Boolean }, inserer d'autre objets si plusieurs poste de travaux ] 
    surface: Number,
	pinned: Boolean,  		// par défaut à false
    comment: String,
	artisans: [{type: mongoose.Schema.Types.ObjectId, ref:'contacts'}],    // [{cle etrangère sur la collection contact}]
	project: {type: mongoose.Schema.Types.ObjectId, ref:'project'}
});

const Room = mongoose.model('rooms', roomSchema);

module.exports = Room;

