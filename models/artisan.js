const mongoose = require('mongoose');

const artisanSchema = mongoose.Schema({

    email: {type: String, default: ''},
    phone: {type: Number, default: null},
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
    company: {type: String, required: true},
    
});

const Artisan = mongoose.model('artisans', artisanSchema);

module.exports = Artisan;