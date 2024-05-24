const express = require('express');
const router = express.Router();

require('../models/connection');
const Teammate = require('../models/teammate');
const Skills = require('../models/skills');



router.post('/newTeammate', async (req, res) => {
  try {
    const newTeammate = new Teammate({
      
        name: req.body.name,
        //avatar: req.body.avatar,
        //items: req.body.items,
        //skills: req.body.skills,

    });

    await newTeammate.save();

    res.status(201).json({ message: 'Teammate successfully created', teammate: newTeammate });
  } catch (error) {
    res.status(500).json({ message: 'Error saving teammate', error });
  }
});



router.put("/addSkillsToTeammate/:teammateId/:skillsId/", async (req, res) => {
    try {
      const teammate = await Teammate.findOne({ _id: req.params.teammateId });
      const skills = await Skills.findOne({ _id: req.params.skillsId });
  
      if (!(teammate && skills)) {
        return res.status(401).json({ message: 'User or skills not found' });
      }
  
      await Teammate.updateOne({_id: req.params.teammateId}, {skills: req.params.skillsId}, {new: true});
  
      res.status(200).json({ message: 'Skills added successfully', teammate: teammate });
    } catch (error) {
      res.status(500).json({ message: 'Error during addition', error });
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

