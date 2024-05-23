const express = require('express');
const router = express.Router();

require('../models/connection');
const Project = require('../models/project');
const Room = require('../models/room');
const User = require('../models/user');



router.post('/newProject', async (req, res) => {
  try {

    const user = await User.findOne({token: req.body.token});

    const userId = user._id;

    const newProject = new Project({
      
        user: userId,
        name: req.body.name,
        budget: req.body.budget,
        //picture: req.body.picture,
        //rooms: req.body.rooms,
        location: req.body.location,
        //archived: req.body.archived,
        //pinned: req.body.pinned,
        //creationDate: req.body.creationDate

    });

    await newProject.save();

    res.status(201).json({ message: 'Project successfully created', project: newProject });
  } catch (error) {
    res.status(500).json({ message: 'Error saving project', error });
  }
});


    router.get("/getProject/:id", async (req, res) => {
      try {
        const project = await Project.findOne({ _id: req.params.id });
    
        if (!project) {
          return res.status(401).json({ message: 'Project not found' });
        }
    
        res.status(200).json({ message: 'Project found', project: project });
      } catch (error) {
        res.status(500).json({ message: 'Error during search', error });
      }
    });


/*
    router.put("/editProject/:id/:user/:name/:budget/:picture/:rooms/:archived/:pinned/:creationDate", async (req, res) => {
      try {
        const project = await Project.findByIdAndUpdate({ _id: req.params.id }, {
            user: req.params.user,
            name: req.params.name,
            budget: req.params.budget,
            picture: req.params.avatar,
            rooms: req.params.rooms,
            archived: req.params.archived,
            pinned: req.params.archived,
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
*/

    router.put("/setProjectPicture/:id/:picture", async (req, res) => {
        try {
          const project = await Project.findByIdAndUpdate({ _id: req.params.id }, {
              picture: req.params.picture
              }, {new: true});
      
          if (!project) {
            return res.status(401).json({ message: 'Project not found' });
          }
      
          res.status(200).json({ message: 'Project picture set successfully', project: project });
        } catch (error) {
          res.status(500).json({ message: 'Error during update', error });
        }
      });


    router.put("/setIsProjectPinned/:id/:pinned", async (req, res) => {
        try {
          const project = await Project.findByIdAndUpdate({ _id: req.params.id }, {
              pinned: req.params.pinned,
              }, {new: true});
      
          if (!project) {
            return res.status(401).json({ message: 'Project not found' });
          }
      
          res.status(200).json({ message: 'Project profile updated successfully', project: project });
        } catch (error) {
          res.status(500).json({ message: 'Error during update', error });
        }
      });


    router.put("/setIsProjectArchived/:id/:archived", async (req, res) => {
        try {
          const project = await Project.findByIdAndUpdate({ _id: req.params.id }, {
              archived: req.params.archived,
              }, {new: true});
      
          if (!project) {
            return res.status(401).json({ message: 'Project not found' });
          }
      
          res.status(200).json({ message: 'Project profile updated successfully', project: project });
        } catch (error) {
          res.status(500).json({ message: 'Error during update', error });
        }
      });



    router.put("/addRoomToProject/:projectId/:roomId", async (req, res) => {
        try {
    
            const project = await Project.findOne({ _id: req.params.projectId });
            const room = await Room.findOne({ _id: req.params.roomId });
    
            if (!project) {
                return res.status(401).json({ message: 'Project not found' });
            }
    
            if (!room) {
                return res.status(401).json({ message: 'Room not found' });
            }
    
            if (project.rooms.includes(req.params.roomId)) {
                return res.status(401).json({ message: 'Room already added to project' });
            }

            project.rooms.push(req.params.roomId);

            await project.save();
    
            res.status(200).json({ message: 'Room added to project successfully', room: room });
    
        } catch (error) {
            res.status(500).json({ message: 'Error during update', error });
        }
    });


    router.put("/removeRoomFromProject/:projectId/:roomId", async (req, res) => {
        try {
    
            const project = await Project.findOne({ _id: req.params.projectId });
            console.log(project);
    
            if (!project) {
                return res.status(401).json({ message: 'Project not found' });
            }

            if (!project.rooms.length) {
                return res.status(401).json({ message: 'No room found in project' });
            }

            const index = await project.rooms.findIndex((room) => room._id.toString() === req.params.roomId);
            console.log(project.rooms);
            console.log(req.params.roomId);

            if (index < 0) {
                return res.status(401).json({ message: 'Room not found' });
            }

            project.rooms.splice(index, 1);

            await project.save();
    
            res.status(200).json({ message: 'Room removed from project successfully', project: project });
    
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
  



  router.put("/addArtisanToProject/:projectId/:field/:difficulty", async (req, res) => {
    try {

        const item = {

            id: uid2(24),
            field: req.params.field,
            difficulty: req.params.difficulty,
            /*diy: true,
            artisan: null,        
            teammates: null,*/
        };

        const room = await Room.findByIdAndUpdate({ _id: req.params.roomId }, { $push: { items: item } }, { new: true, useFindAndModify: false });

        if (!room) {
            return res.status(401).json({ message: 'Room not found' });
        }

        res.status(200).json({ message: 'Room updated successfully', room: room });
    } catch (error) {
        res.status(500).json({ message: 'Error during update', error });
    }
});


module.exports = router;

