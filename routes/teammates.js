 

const express = require('express');
const router = express.Router();

require('../models/connection');
const Teammate = require('../models/teammate');
const Skills = require('../models/skills');
const User = require('../models/user');


//-----------------------------------Création d'un nouvel équipier---------------------------//
router.post('/newTeammate/:token', async (req, res) => {
  try {

    const user = await User.findOne({ token: req.params.token });

    const newTeammate = new Teammate({ name: req.body.name });

    await newTeammate.save();

    if (!(newTeammate && user)) {
      return res.status(401).json({ message: 'User or teammate not found' });
    }

    user.teammates.push(newTeammate._id);

    await user.save();

    res.status(201).json({ message: 'Teammate successfully created', teammate: newTeammate });
  } catch (error) {
    res.status(500).json({ message: 'Error saving teammate', error });
  }
});


//-----------------------------Ajout de compétences à un coéquipier--------------------------//
router.put("/addSkillsToTeammate/:teammateId/:skillsId", async (req, res) => {
  try {
    const teammate = await Teammate.findOne({ _id: req.params.teammateId });

    const skills = await Skills.findOne({ _id: req.params.skillsId });

    if (!(teammate && skills)) {
      return res.status(401).json({ message: 'User or skills not found' });
    }

    await Teammate.updateOne({ _id: req.params.teammateId }, { skills: req.params.skillsId });

    res.status(200).json({ message: 'Skills added successfully', teammate: teammate });
  } catch (error) {
    res.status(500).json({ message: 'Error during addition', error });
  }
});

//----------------------------------Récupération d'un coéquipier-------------------------------//
router.get("/getTeammate/:teammateId", async (req, res) => {
  try {
    const teammate = await Teammate.findOne({ _id: req.params.teammateId });

    if (!teammate) {
      return res.status(401).json({ message: 'Teammate not found' });
    }

    res.status(200).json({ message: 'Teammate found', teammate: teammate });
  } catch (error) {
    res.status(500).json({ message: 'Error during search', error });
  }
});


//----------------------------------------Modification d'un coéquipier----------------------------------//
router.put("/editTeammate", async (req, res) => {
  try {
    const teammate = await Teammate.findByIdAndUpdate({ _id: req.body.teammateId }, {

      name: req.body.name,
      avatar: req.body.avatar,

    }, { new: true });

    if (!teammate) {
      return res.status(401).json({ message: 'Teammate not found' });
    }

    res.status(200).json({ message: 'Teammate profile updated successfully', teammate: teammate });
  } catch (error) {
    res.status(500).json({ message: 'Error during update', error });
  }
});


//-----------------------------------Suppression d'un coéquipier-----------------------------//
router.delete("/deleteTeammate/:teammateId", async (req, res) => {
  try {
    const teammate = await Teammate.findByIdAndDelete({ _id: req.params.teammateId});

    if (!teammate) {
      return res.status(401).json({ message: 'Teammate not found' });
    }

    res.status(200).json({ message: 'Teammate deleted successfully', teammate: teammate });
  } catch (error) {
    res.status(500).json({ message: 'Error during deletion', error });
  }
});



module.exports = router;