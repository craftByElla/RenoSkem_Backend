const express = require('express');
const router = express.Router();

require('../models/connection');
const Artisan = require('../models/artisan');



router.post('/newArtisan', async (req, res) => {
  try {
    const newArtisan = new Artisan({
      
        email: req.body.email,
        phone: req.body.phone,
        field: req.body.field,
        company: req.body.company,
        availability: req.body.availability, 
        trustLevel: req.body.trustLevel,											
	    quote: req.body.quote,									
	    comment: req.body.comment
    });

    await newArtisan.save();

    res.status(201).json({ message: 'Artisan successfully created', artisan: newArtisan });
  } catch (error) {
    res.status(500).json({ message: 'Error saving artisan', error });
  }
});


    router.get("/getArtisan/:id", async (req, res) => {
      try {
        const artisan = await Artisan.findOne({ _id: req.params.id });
    
        if (!artisan) {
          return res.status(401).json({ message: 'Artisan not found' });
        }
    
        res.status(200).json({ message: 'Artisan found', artisan: artisan });
      } catch (error) {
        res.status(500).json({ message: 'Error during search', error });
      }
    });



    router.put("/editArtisan/:id/:email/:phone/:field/:company/:availability/:trustLevel/:quote/:comment", async (req, res) => {
      try {
        const artisan = await Artisan.findByIdAndUpdate({ _id: req.params.id }, {
            email: req.params.email,
            phone: req.params.phone,
            field: req.params.field,
            company: req.params.company,
            availability: req.params.availability, 
            trustLevel: req.params.trustLevel,											
            quote: req.params.quote,									
            comment: req.params.comment
            }, {new: true});
    
        if (!artisan) {
          return res.status(401).json({ message: 'Artisan not found' });
        }
    
        res.status(200).json({ message: 'Artisan profile updated successfully', artisan: artisan });
      } catch (error) {
        res.status(500).json({ message: 'Error during update', error });
      }
    });




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
  


module.exports = router;

