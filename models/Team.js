const mongoose = require('mongoose');                                // model de la team

const teamSchema = mongoose.Schema({                                 
	                                      
    colleagueName: [String],
    
    
});

const Team = mongoose.model('teams', teamSchema);

module.exports = Team;