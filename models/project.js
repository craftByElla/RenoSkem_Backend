const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({     // modèle du projet
	                               
	user: { type: mongoose.Schema.Types.ObjectId, ref:'user' },
	name: String,
	budget: Number,
    picture: { type: String, default: null },
	location: String,  
    rooms: { type: [{type: mongoose.Schema.Types.ObjectId, ref:'rooms'}], default: null},     // [{cle etrangere sur la collection room }]
	archived: { type: Boolean, default: false },
	pinned: { type: Boolean, default: false },
	creationDate: { type: Date, default: Date.now }  

});

const Project = mongoose.model('projects', projectSchema);

module.exports = Project;

