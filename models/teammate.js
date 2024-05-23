const mongoose = require('mongoose');                                // modèle de la team
                                             
const teammateSchema = mongoose.Schema({                                 
	                                      
    name: String,
    avatar: {type: String, default: null},
    items: {type: [{type: String, ref:'items'}], default: []},
    skills: {type: mongoose.Schema.Types.ObjectId, ref:'skills', default: null}
    
});

const Teammate = mongoose.model('teammates', teammateSchema);

module.exports = Teammate;