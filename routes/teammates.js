const express = require('express');
const router = express.Router();

require('../models/connection');
const Teammate = require('../models/teammate');



router.post('/newTeammate', async (req, res) => {
  try {
    const newTeammate = new Teammate({
      
        name: req.body.name,
        avatar: req.body.avatar,
        items: req.body.items,
        skills: req.body.skills,

    });

    await newTeammate.save();

    res.status(201).json({ message: 'Teammate successfully created', teammate: newTeammate });
  } catch (error) {
    res.status(500).json({ message: 'Error saving teammate', error });
  }
});


    router.get("/getTeammate/:id", async (req, res) => {
      try {
        const teammate = await Teammate.findOne({ _id: req.params.id });
    
        if (!teammate) {
          return res.status(401).json({ message: 'Teammate not found' });
        }
    
        res.status(200).json({ message: 'Teammate found', teammate: teammate });
      } catch (error) {
        res.status(500).json({ message: 'Error during search', error });
      }
    });



    router.put("/editTeammate/:id/:name/:avatar/:items/:skills", async (req, res) => {
      try {
        const teammate = await Teammate.findByIdAndUpdate({ _id: req.params.id }, {
                name: req.params.name,
                avatar: req.params.avatar,
                items: req.params.items,
                skills: req.params.skills,
            }, {new: true});
    
        if (!teammate) {
          return res.status(401).json({ message: 'Teammate not found' });
        }
    
        res.status(200).json({ message: 'Teammate profile updated successfully', teammate: teammate });
      } catch (error) {
        res.status(500).json({ message: 'Error during update', error });
      }
    });



  router.delete("/deleteTeammate/:id", async (req, res) => {
    try {
      const teammate = await Teammate.findByIdAndDelete({ _id: req.params.id });
  
      if (!teammate) {
        return res.status(401).json({ message: 'Teammate not found' });
      }
  
      res.status(200).json({ message: 'Teammate deleted successfully', teammate: teammate });
    } catch (error) {
      res.status(500).json({ message: 'Error during deletion', error });
    }
  });
  


module.exports = router;

