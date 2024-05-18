const mongoose = require('mongoose');                                // model de la team

const skillsSchema = mongoose.Schema({                                 
	                                      
	skills: {
        'Chauffage': Number,
        'Cloisonnement/Plâtrage': Number,
        'Démolition': Number,
        'Électricité': Number,
        'Étanchéité': Number,
        'Façade': Number,
        'Fondations': Number,
        'Installation cuisine/SDB': Number,
        'Isolation': Number,
        'Maçonnerie': Number,
        'Menuiserie': Number,
        'Montage de meuble': Number,
        'Peinture': Number,
        'Plomberie': Number,
        'Revêtement muraux': Number,
        'Revêtement sol': Number,
        'Revêtements extérieurs': Number,
        'Toiture': Number,
        'Ventilation': Number
    }
});

const Skills = mongoose.model('skills', skillsSchema);

module.exports = Skills;