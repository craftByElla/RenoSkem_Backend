const mongoose = require('mongoose');                                // model de la team

const skillsSchema = mongoose.Schema({                                 
	                                      
	
        'Chauffage': { type: Number, enum: [1, 2, 3], required: true  },
        'Cloisonnement/Plâtrage': { type: Number, enum: [1, 2, 3], required: true  },
        'Démolition': { type: Number, enum: [1, 2, 3], required: true  },
        'Électricité': { type: Number, enum: [1, 2, 3], required: true  },
        'Étanchéité': { type: Number, enum: [1, 2, 3], required: true  },
        'Façade': { type: Number, enum: [1, 2, 3], required: true  },
        'Fondations': { type: Number, enum: [1, 2, 3], required: true  },
        'Installation cuisine/SDB': { type: Number, enum: [1, 2, 3], required: true  },
        'Isolation': { type: Number, enum: [1, 2, 3], required: true  },
        'Maçonnerie': { type: Number, enum: [1, 2, 3], required: true  },
        'Menuiserie': { type: Number, enum: [1, 2, 3], required: true  },
        'Montage de meuble': { type: Number, enum: [1, 2, 3], required: true  },
        'Peinture': { type: Number, enum: [1, 2, 3], required: true  },
        'Plomberie': { type: Number, enum: [1, 2, 3], required: true  },
        'Revêtements muraux': { type: Number, enum: [1, 2, 3], required: true  },
        'Revêtements sol': { type: Number, enum: [1, 2, 3], required: true  },
        'Revêtements extérieurs': { type: Number, enum: [1, 2, 3], required: true  },
        'Toiture': { type: Number, enum: [1, 2, 3], required: true  },
        'Ventilation': { type: Number, enum: [1, 2, 3], required: true  }

});

const Skills = mongoose.model('skills', skillsSchema);

module.exports = Skills;