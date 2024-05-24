const express = require('express');
const router = express.Router();

require('../models/connection');
const Project = require('../models/project');
const Room = require('../models/room');
const User = require('../models/user');


//-------Route pour créer un nouveau projet-----------//
router.post('/newProject', async (req, res) => {
  try {
    // console.log('Requête reçue avec les données :', req.body);

    const user = await User.findOne({ token: req.body.token });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = user._id;

    // console.log('Image reçue :', req.body.picture);

    const newProject = new Project({
      user: userId,
      name: req.body.name,
      budget: req.body.budget,
      picture: req.body.picture,
      location: req.body.location,
      comment: req.body.comment,
    });

    // console.log('Nouveau projet avant sauvegarde :', newProject);

    await newProject.save();

    // console.log('Nouveau projet après sauvegarde :', newProject);

    res.status(201).json({ message: 'Project successfully created', project: newProject });
  } catch (error) {
    res.status(500).json({ message: 'Error saving project', error: error.message });
  }
});
//--------Route pour modifier un projet------------//

router.put("/editproject/:id", async (req, res) => {
  // console.log("PUT /editproject/:id called");
  // console.log("req.params.id:", req.params.id);
  // console.log("req.body:", req.body);
  
  try {
      const project = await Project.findByIdAndUpdate(req.params.id, {
          name: req.body.name,
          budget: req.body.budget,
          location: req.body.location,
          picture: req.body.picture,
          comment: req.body.comment,
      }, { new: true });
      
      // console.log("Updated project:", project);

      if (!project) {
          return res.status(401).json({ message: 'Project not found' });
      }

      res.status(200).json({ message: 'Project profile updated successfully', project: project });
  } catch (error) {
      // console.error("Error during update:", error);
      res.status(500).json({ message: 'Error during update', error });
  }
});

//---------Route pour chercher un projet by id ---------//

router.get("/getProject/:id", async (req, res) => {
  // console.log("GET /getProject/:id called");
  // console.log("req.params.id:", req.params.id);
 
  
  try {
      const project = await Project.findOne({ _id: req.params.id });
      // console.log("project:", project);

      if (!project) {
          return res.status(401).json({ message: 'Project not found' });
      }

      res.status(200).json({ message: 'Project found', project: project });
  } catch (error) {
      // console.error("Error during search:", error);
      res.status(500).json({ message: 'Error during search', error });
  }
});

//--------Route pour récupérer tout les projets d'un utilisateur------------//
 
router.get("/getUserProjects/:token", async (req, res) => {
  try {
    // console.log("Received request with token:", req.params.token);
    
    const user = await User.findOne({ token: req.params.token });
    if (!user) {
      // console.log("User not found for token:", req.params.token);
      return res.status(401).json({ message: 'User not found' });
    }

    const userId = user._id;
    // console.log("Found user with ID:", userId);

    const projects = await Project.find({ user: userId });
    if (!projects) {
      // console.log("No projects found for user ID:", userId);
      return res.status(401).json({ message: 'No project found' });
    }

    // console.log("Projects found:", projects);
    res.status(200).json({ message: 'Projects found', projects: projects });
  } catch (error) {
    // console.error("Error during search:", error);
    res.status(500).json({ message: 'Error during search', error });
  }
});



    //------Route pour épingler un projet------------//
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

    //------Route pour archiver un projet------------//
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
            // console.log(project);
    
            if (!project) {
                return res.status(401).json({ message: 'Project not found' });
            }

            if (!project.rooms.length) {
                return res.status(401).json({ message: 'No room found in project' });
            }

            const index = await project.rooms.findIndex((room) => room._id.toString() === req.params.roomId);
            // console.log(project.rooms);
            // console.log(req.params.roomId);

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


  //------Route pour supprimer un projet-----------/
  router.delete("/deleteProject/:id", async (req, res) => {
    // console.log("Requête reçue pour supprimer le projet avec l'ID:", req.params.id);
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            // console.log("Projet non trouvé");
            return res.status(401).json({ message: 'Project not found' });
        }
        // console.log("Projet supprimé avec succès:", project);
        res.status(200).json({ message: 'Project deleted successfully', project: project });
    } catch (error) {
        // console.error("Erreur lors de la suppression du projet:", error);
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

