const express = require('express');
const router = express.Router();

require('../models/connection');
const Artisan = require('../models/artisan');



//--------------------------------Création d'un nouvel artisan-------------------------//
router.post('/newArtisan', async (req, res) => {
  try {
    //changeer le fetch lié à artisansScreenProject pour décommenter 
    //const user = await User.findOne({ token: req.body.token });

    const newArtisan = new Artisan({

      email: req.body.email,
      phone: req.body.phone,
      field: req.body.field,
      company: req.body.company,

    });

    await newArtisan.save();

    // if (!(newArtisan && user)) {
    //   return res.status(401).json({ message: 'User or artisan not found' });
    // }

    //user.artisans.push(newArtisan._id);

    //await user.save();

    res.status(201).json({ message: 'Artisan successfully created', artisan: newArtisan });
  } catch (error) {
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

