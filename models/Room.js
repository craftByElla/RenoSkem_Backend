const mongoose = require('mongoose');                                // model de la room

const itemSchema = mongoose.Schema({                                 
	                                     
	field: String, 																// à quel dommaine appartient le travaux
	difficulty: Number, 
	diy: {type: Boolean, default: null},
	artisan: {type: mongoose.Schema.Types.ObjectId, ref:'artisan', default: null},         //[{ cle etrangere sur la collection team}]
	teammates: [{type: mongoose.Schema.Types.ObjectId, ref:'teammates', default: null}],         //[{ cle etrangere sur la collection team}]         

});




const roomSchema = mongoose.Schema({                                 
	 
	type: String,
	name: String,
    items: { type: [itemSchema], default: null },  // [{name:String, level: Number, DIYorPRO: Boolean }, inserer d'autre objets si plusieurs poste de travaux ] 
    surface: { type: Number, default: null },
    comment: { type: String, default: null },
	project: { type: mongoose.Schema.Types.ObjectId, ref:'project', default: null }
});

const Room = mongoose.model('rooms', roomSchema);

module.exports = Room;

