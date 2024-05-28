const mongoose = require('mongoose');


const projectArtisanSchema = mongoose.Schema({                                 
                                         
    artisanId: {type: mongoose.Schema.Types.ObjectId, ref:'artisan', default: null},
    availability: { type: Date, default: null },               
    trustLevel: { type: Number, enum: [1, 2, 3], default: null },                                             
    quote: { type: Number, default: null },   //    devis
    comment: { type: String, default: '' } 
});


const projectSchema = mongoose.Schema({     // modèle du projet
                                   
    name: { type: String, required: true },
    budget: { type: Number, required: false },
    picture: { type: String, default: '' },
    location: { type: String, required: false },  
    rooms: { type: [{type: mongoose.Schema.Types.ObjectId, ref:'rooms'}], default: []},   
    archived: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
    creationDate: { type: Date, default: Date.now },
    artisans: { type: [projectArtisanSchema], default: []}, 
    comment: { type: String, default: '' }   

});

const Project = mongoose.model('projects', projectSchema);

module.exports = Project;