const express = require('express');
const router = express.Router();

require('../models/connection');
const Project = require('../models/project');
const authMiddleware = require('../modules/authMiddleware')



router.post('/newProject/:token', authMiddleware, async (req, res) => {
  console.log('userId', req.userId)
  try {
    const newProject = new Project({
      
        user: req.userId,
        name: req.body.name,
        budget: req.body.budget,
        picture: req.body.picture,
        rooms: req.body.rooms,
        archived: req.body.archived,
        pinned: req.body.pinned,
        creationDate: req.body.creationDate

    });

    await newProject.save();

    res.status(201).json({ message: 'Project successfully created', project: newProject });
  } catch (error) {
    res.status(500).json({ message: 'Error saving project', error });
  }
});


    router.get("/getProject/:token", authMiddleware, async (req, res) => {
      try {
        const project = await Project.findOne({ _id: req.userId });
    
        if (!project) {
          return res.status(401).json({ message: 'Project not found' });
        }
    
        res.status(200).json({ message: 'Project found', project: project });
      } catch (error) {
        res.status(500).json({ message: 'Error during search', error });
      }
    });



    router.put("/editProject/:id/:user/:name/:budget/:picture/:rooms/:archived/:creationDate", async (req, res) => {
      try {
        const project = await Project.findByIdAndUpdate({ _id: req.params.id }, {
            user: req.params.user,
            name: req.params.name,
            budget: req.params.budget,
            picture: req.params.avatar,
            rooms: req.params.rooms,
            archived: req.params.archived,
            creationDate: req.params.creationDate
            }, {new: true});
    
        if (!project) {
          return res.status(401).json({ message: 'Project not found' });
        }
    
        res.status(200).json({ message: 'Project profile updated successfully', project: project });
      } catch (error) {
        res.status(500).json({ message: 'Error during update', error });
      }
    });



  router.delete("/deleteProject/:id", async (req, res) => {
    try {
      const project = await Project.findByIdAndDelete({ _id: req.params.id });
  
      if (!project) {
        return res.status(401).json({ message: 'Project not found' });
      }
  
      res.status(200).json({ message: 'Project deleted successfully', project: project });
    } catch (error) {
      res.status(500).json({ message: 'Error during deletion', error });
    }
  });
  


module.exports = router;

