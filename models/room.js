const mongoose = require('mongoose');                           

const itemSchema = mongoose.Schema({                                 
                                         
    id: { type: String, required: true },
    field: { type: String, enum: [
        "Chauffage",
        "Cloisonnement/Plâtrage",
        "Démolition",
        "Électricité",
        "Étanchéité",
        "Façade",
        "Fondations",
        "Installation cuisine/SDB",
        "Isolation",
        "Maçonnerie",
        "Menuiserie",
        "Montage de meuble",
        "Peinture",
        "Plomberie",
        "Revêtements muraux",
        "Revêtements sol",
        "Revêtements extérieurs",
        "Toiture",
        "Ventilation"
    ], required: true },                                                            
    difficulty: {type: Number, enum: [1, 2, 3], required: true},
    diy: {type: Boolean, default: true, required: true},
    artisan: {type: mongoose.Schema.Types.ObjectId, ref:'artisan', default: null},         
    teammates: {type: [{type: mongoose.Schema.Types.ObjectId, ref:'teammates'}], default: []}        

});

const roomSchema = mongoose.Schema({                                 
     
    type: { type: String, enum: [
        "Balcon",
        "Buanderie",
        "Bureau",
        "Cave",
        "Chambre",
        "Cuisine",
        "Entrée",
        "Garage",
        "Grenier/Combles",
        "Jardin",
        "Salle à manger",
        "Salle de bain",
    ], required: true}, 
    name: { type: String, default: null },
    items: { type: [itemSchema], default: [] },  // [{name:String, level: Number, DIYorPRO: Boolean }, inserer d'autre objets si plusieurs poste de travaux ] 
    surface: { type: Number, default: null },
    comment: { type: String, default: '' },
    project: { type: mongoose.Schema.Types.ObjectId, ref:'project', default: null }
});

const Room = mongoose.model('rooms', roomSchema);

module.exports = Room;