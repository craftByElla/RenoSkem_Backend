const mongoose = require('mongoose');                                // model de la room

const roomSchema = mongoose.Schema({                                 
	                                      
	roomName: String,
    worksPost: Object,   // [{name:String, level: Number, DIYorPRO: Boolean }, inserer d'autre objets si plusieurs poste de travaux ] 
    surface: Number,
	priority: Boolean,
    comment: String,
	contacts: Object,    // [{cle etrangère sur la collection contact}]
	team:Object,         //[{ cle etrangere sur la collection team}]
});

const Room = mongoose.model('rooms', roomSchema);

module.exports = Room;

