const mongoose = require('mongoose');                                // modèle de la team
                                             
const teammateSchema = mongoose.Schema({                                 
	                                      
    name: String,
    item: [{type: mongoose.Schema.Types.ObjectId, ref:'item'}],
    skills: {type: mongoose.Schema.Types.ObjectId, ref:'skills'}
    
});

const Teammate = mongoose.model('teammates', teammateSchema);

module.exports = Teammate;