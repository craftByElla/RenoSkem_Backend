const express = require('express');
const router = express.Router();

require('../models/connection');
const Artisan = require('../models/artisan');
const User = require('../models/user');


//--------------------------------Création d'un nouvel artisan-------------------------//
router.post('/newArtisan/:token', async (req, res) => {
  try {
    //changer le fetch lié à artisansScreenProject pour décommenter 
    const user = await User.findOne({ token: req.params.token });

    const newArtisan = await new Artisan({

      email: req.body.email,
      phone: req.body.phone,
      field: req.body.field,
      company: req.body.company,

    });

    // Log des données reçues de la requête
    console.log('Received data:', req.body);
    console.log(newArtisan)
    console.log(user)

    // Enregistrement du nouvel artisan dans la base de données
    await newArtisan.save();

     if (!(newArtisan && user)) {
     return res.status(401).json({ message: 'User or artisan not found' });
    }

    user.artisans.push(newArtisan._id);

    await user.save();

    res.status(201).json({ message: 'Artisan successfully created', artisan: newArtisan });
  } catch (error) {
    // En cas d'erreur, log de l'erreur
    console.error('Error saving artisan:', error);

    // Envoi d'une réponse d'erreur au client
    res.status(500).json({ message: 'Error saving artisan', error });
  }
});




//--------à refaire---------//
  router.delete("/deleteArtisan/:id", async (req, res) => {
    try {
      const artisan = await Artisan.findByIdAndDelete({ _id: req.params.id });
  
      if (!artisan) {
        return res.status(401).json({ message: 'Artisan not found' });
      }
  
      res.status(200).json({ message: 'Artisan deleted successfully', artisan: artisan });
    } catch (error) {
      res.status(500).json({ message: 'Error during deletion', error });
  }
});
  
//--------Routes non utilisées----------//
// router.get("/getArtisan/:id", async (req, res) => {
//   try {
//     const artisan = await Artisan.findOne({ _id: req.params.id });
    
//     if (!artisan) {
//       return res.status(401).json({ message: 'Artisan not found' });
//     }
    
//     res.status(200).json({ message: 'Artisan found', artisan: artisan });
//   } catch (error) {
//     res.status(500).json({ message: 'Error during search', error });
//   }
// });


module.exports = router;

