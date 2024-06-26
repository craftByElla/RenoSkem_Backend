const mongoose = require('mongoose');


const projectArtisanSchema = mongoose.Schema({                                 
	                                     
	artisanId: {type: mongoose.Schema.Types.ObjectId, ref:'artisan', default: null},
	availability: { type: Date, default: null },               
	trustLevel: { type: Number, enum: [1, 2, 3], default: null }, 											
	quote: { type: Number, default: null }, 											//	devis
	comment: { type: String, default: null } 
	      
});


const projectSchema = mongoose.Schema({     // modèle du projet
	                               
	user: { type: mongoose.Schema.Types.ObjectId, ref:'user', required: true },
	name: { type: String, required: true },
	budget: { type: Number, required: true },
    picture: { type: String, default: null },
	location: { type: String, required: true },  
    rooms: { type: [{type: mongoose.Schema.Types.ObjectId, ref:'rooms'}], default: []},   
	archived: { type: Boolean, default: false },
	pinned: { type: Boolean, default: false },
	creationDate: { type: Date, default: Date.now },
	artisans: { type: [projectArtisanSchema], default: []},   

});

const Project = mongoose.model('projects', projectSchema);

module.exports = Project;

