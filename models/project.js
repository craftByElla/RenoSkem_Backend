const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({     // modèle du projet
	                               
	user: {type: mongoose.Schema.Types.ObjectId, ref:'user'},
	name: String,
	budget: Number,
    picture: String,
	location: String,  
    rooms: [{type: mongoose.Schema.Types.ObjectId, ref:'rooms'}],     // [{cle etrangere sur la collection room }]
	archived: Boolean,
	creationDate: Date

});

const Projet = mongoose.model('projects', projectSchema);

module.exports = Project;

