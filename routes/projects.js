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
      picture: req.body.picture ? `projectIcon/${req.body.picture}` : null, //Stockage du chemin relatif de l'avatar et non l'URL complète
      location: req.body.location,
      comment: req.body.comment,
    });

    // console.log('Nouveau projet avant sauvegarde :', newProject);
    // Ajoute le projet au profil du user
    user.projects.push(newProject._id);
    await user.save();
    //Enregistre le projet dans la base de données projets
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
          picture: req.body.picture ? `projectIcon/${req.body.picture}` : null, //Stockage du chemin relatif de l'avatar et non l'URL complète
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


  //------Route pour supprimer un projet-----------//
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


//----------------------Fonction pour gérer l'odre des tache------------//
function taskSort(project){
  console.log('taskSort - 1: Start of taskSort');

  const rooms = project.rooms;
  const roomsPlannings = [];
  const projectPlanning = [];
  console.log('taskSort - 2: Initial variables set');

  for(let i = 0; i < rooms.length; i++){ 
      console.log(`taskSort - 3: Processing room ${i}`);

      let step = 1;  

      let dependenciesObj = {
          "Chauffage": ["Démolition"],
          "Cloisonnement/Plâtrage": ["Démolition"],
          "Démolition": [],
          "Électricité": ["Démolition", "Cloisonnement/Plâtrage"],
          "Étanchéité": ["Toiture"],
          "Façade": ["Étanchéité"],
          "Fondations": ["Démolition"],
          "Installation cuisine/SDB": ["Plomberie", "Électricité", "Cloisonnement/Plâtrage", "Revêtement muraux"],
          "Isolation": ["Cloisonnement/Plâtrage"],
          "Maçonnerie": ["Fondations"],
          "Menuiserie": ["Démolition"],
          "Montage de meuble": ["Peinture"],
          "Peinture": ["Cloisonnement/Plâtrage", "Menuiserie"],
          "Plomberie": ["Démolition"],
          "Revêtement muraux": ["Cloisonnement/Plâtrage"],
          "Revêtement sol": ["Démolition", "Fondations"],
          "Revêtements extérieurs": ["Démolition"],
          "Toiture": ["Maçonnerie"],
          "Ventilation": ["Démolition"]
      }; 
      console.log('taskSort - 4: Dependencies set');

      let roomSortedTasks = {
          "Chauffage": { step: -1, diy: true, artisan: null, teammates: [] } ,
          "Cloisonnement/Plâtrage": { step: -1, diy: true, artisan: null, teammates: [] },
          "Démolition": { step: -1, diy: true, artisan: null, teammates: [] },
          "Électricité": { step: -1, diy: true, artisan: null, teammates: [] },
          "Étanchéité": { step: -1, diy: true, artisan: null, teammates: [] },
          "Façade": { step: -1, diy: true, artisan: null, teammates: [] },
          "Fondations": { step: -1, diy: true, artisan: null, teammates: [] },
          "Installation cuisine/SDB": { step: -1, diy: true, artisan: null, teammates: [] },
          "Isolation": { step: -1, diy: true, artisan: null, teammates: [] },
          "Maçonnerie": { step: -1, diy: true, artisan: null, teammates: [] },
          "Menuiserie": { step: -1, diy: true, artisan: null, teammates: [] },
          "Montage de meuble": { step: -1, diy: true, artisan: null, teammates: [] },
          "Peinture": { step: -1, diy: true, artisan: null, teammates: [] },
          "Plomberie": { step: -1, diy: true, artisan: null, teammates: [] },
          "Revêtement muraux": { step: -1, diy: true, artisan: null, teammates: [] },
          "Revêtement sol": { step: -1, diy: true, artisan: null, teammates: [] },
          "Revêtements extérieurs": { step: -1, diy: true, artisan: null, teammates: [] },
          "Toiture": { step: -1, diy: true, artisan: null, teammates: [] },
          "Ventilation": { step: -1, diy: true, artisan: null, teammates: [] }
      };
      console.log('taskSort - 5: roomSortedTasks initialized');
      
      if(rooms[i].items && rooms[i].items.length > 0){
          console.log(`taskSort - 6: Room ${i} has items`);

          const tasks = rooms[i].items.map(item => item.field);
          console.log('taskSort - 7: Tasks extracted', tasks);

          for(let key in dependenciesObj){  
              console.log('taskSort - 8: Checking dependencies for key:', key);                                   
              if(!tasks.includes(key)){
                  delete dependenciesObj[key];
                  for(let key2 in dependenciesObj){
                      const index = dependenciesObj[key2].indexOf(key)
                      if(index > -1){
                          dependenciesObj[key2].splice(index,1);
                      }
                  }        
              }
          }
          console.log('taskSort - 9: Dependencies filtered', dependenciesObj);
         
          while(Object.keys(dependenciesObj).length){   
              console.log('taskSort - 10: Dependencies left', dependenciesObj);                                                                 
 
              let completedTasks = [];                                                         
              for(let key in dependenciesObj){  
                  console.log('taskSort - 11: Checking if key has no dependencies:', key);                                   
                  if(dependenciesObj[key].length === 0){              
                      console.log('taskSort - 12: Key has no dependencies:', key);             
                      roomSortedTasks[key].step = step;
                      for(let j = 0; j < rooms[i].items.length; j++){    
                          console.log(`taskSort - 13: Checking room items ${j}`);              
                          if(key === rooms[i].items[j].field){        
                              console.log('taskSort - 14: Found matching task');              
                              roomSortedTasks[key].diy = rooms[i].items[j].diy;
                              roomSortedTasks[key].artisan = rooms[i].items[j].artisan;
                              roomSortedTasks[key].teammates = rooms[i].items[j].teammates;                                                        
                              break;
                          }   
                          console.log('taskSort - 15: Completed room item check');
                      }       
                      completedTasks.push(key); 
                      console.log('taskSort - 16: Added to completedTasks:', completedTasks);                        
                  }
                  console.log('taskSort - 17: Key check completed');
              }
              console.log('taskSort - 18: Completed tasks check done', completedTasks);

              for(let key of completedTasks){                       
                  console.log('taskSort - 19: Deleting completed task from dependencies:', key);                              
                  delete dependenciesObj[key];   
                  console.log('taskSort - 20: Dependencies left', Object.keys(dependenciesObj).length);                 
                  if(Object.keys(dependenciesObj).length){
                      for(let key2 in dependenciesObj){   
                          console.log('taskSort - 21: Updating dependencies for:', key2);                                            
                          const index = dependenciesObj[key2].indexOf(key)
                          if(index > -1){
                              console.log('taskSort - 22: Removing dependency:', key); 
                              dependenciesObj[key2].splice(index,1);
                          }
                          console.log('taskSort - 23: Dependency update completed');
                      }
                  }
                  console.log('taskSort - 24: Completed dependency update');
              }
              console.log('taskSort - 25: Step completed, moving to next step');
              step++;
          }
          console.log('taskSort - 26: All dependencies resolved for room');
          roomsPlannings.push({ type: rooms[i].type, name: rooms[i].name, items: roomSortedTasks });
          console.log('taskSort - 27: Room planning added:', roomsPlannings);
      } else {
          console.log(`taskSort - 6: Room ${i} has no items or items is undefined`);
      }
  }

  console.log('taskSort - 28: All rooms processed');
  if (roomsPlannings.length === 0) {
      console.log('taskSort - 29: No room plannings to process');
      return [];
  }
  let maxStepChauffage = roomsPlannings[0].items["Chauffage"].step;
  let maxStepElectricite = roomsPlannings[0].items["Électricité"].step;
  let maxStepFacade = roomsPlannings[0].items["Façade"].step;
  let maxStepToiture = roomsPlannings[0].items["Toiture"].step; 
  console.log('taskSort - 30: Initial max steps set');

  for(let i = 1; i < roomsPlannings.length; i++){
      console.log(`taskSort - 31: Checking room planning ${i}`);
      maxStepChauffage = roomsPlannings[i].items["Chauffage"].step > maxStepChauffage ? roomsPlannings[i].items["Chauffage"].step : maxStepChauffage;
      maxStepElectricite = roomsPlannings[i].items["Électricité"].step > maxStepElectricite ? roomsPlannings[i].items["Électricité"].step : maxStepElectricite;
      maxStepFacade = roomsPlannings[i].items["Façade"].step > maxStepFacade ? roomsPlannings[i].items["Façade"].step : maxStepFacade;
      maxStepToiture = roomsPlannings[i].items["Toiture"].step > maxStepToiture ? roomsPlannings[i].items["Toiture"].step : maxStepToiture;
      console.log('taskSort - 32: Updated max steps:', maxStepChauffage, maxStepElectricite, maxStepFacade, maxStepToiture);
  }
            
  for(let i = 0; i < roomsPlannings.length; i++){
      console.log(`taskSort - 33: Updating room planning steps for room ${i}`);
      roomsPlannings[i].items["Chauffage"].step = maxStepChauffage;
      roomsPlannings[i].items["Électricité"].step = maxStepElectricite;
      roomsPlannings[i].items["Façade"].step = maxStepFacade;
      roomsPlannings[i].items["Toiture"].step = maxStepToiture;

      if(roomsPlannings[i].items["Installation cuisine/SDB"].step > 0){
          roomsPlannings[i].items["Installation cuisine/SDB"].step = maxStepElectricite >= roomsPlannings[i].items["Installation cuisine/SDB"].step ? maxStepElectricite + 1 : roomsPlannings[i].items["Installation cuisine/SDB"].step;        
      }
      console.log('taskSort - 34: Updated Installation cuisine/SDB step');

      if(roomsPlannings[i].items["Étanchéité"].step > 0){
          roomsPlannings[i].items["Étanchéité"].step = maxStepToiture >= roomsPlannings[i].items["Étanchéité"].step ? maxStepToiture + 1 : roomsPlannings[i].items["Étanchéité"].step;
          roomsPlannings[i].items["Façade"].step = roomsPlannings[i].items["Étanchéité"].step >= roomsPlannings[i].items["Façade"].step ? roomsPlannings[i].items["Étanchéité"].step + 1 : roomsPlannings[i].items["Façade"].step;
      }
      console.log('taskSort - 35: Updated Étanchéité and Façade steps');
  }
  console.log('taskSort - 36: Steps updated for all rooms');

  let steps = 0;
  for(let i = 0; i < roomsPlannings.length; i++){
      console.log(`taskSort - 37: Calculating total steps for room ${i}`);
      for(let key in roomsPlannings[i].items){
          steps = roomsPlannings[i].items[key].step > steps ? roomsPlannings[i].items[key].step : steps;
          console.log('taskSort - 38: Updated steps:', steps);
      }
  }

  for(let i = 0; i < steps; i++){
      projectPlanning.push({ step: i + 1, items: []});
      console.log('taskSort - 39: Added step to projectPlanning:', projectPlanning);
  }

  for(let i = 0; i < roomsPlannings.length; i++){
      for(let key in roomsPlannings[i].items){
          if (roomsPlannings[i].items[key].step > 0) {
              const item = {     
                  field: key,
                  type: roomsPlannings[i].type,
                  name: roomsPlannings[i].name,
                  diy: roomsPlannings[i].items[key].diy,
                  artisan: roomsPlannings[i].items[key].artisan,
                  teammates: roomsPlannings[i].items[key].teammates
              };  
              console.log('taskSort - 40: Adding item to projectPlanning:', item);  
              projectPlanning[roomsPlannings[i].items[key].step - 1].items.push(item); 
          }          
          console.log('taskSort - 41: Item added to projectPlanning');
      }
  }

  console.log('taskSort - 42: End of taskSort');
  return projectPlanning;
}

  
  
  
router.get("/getProjectPlanning/:projectId", async (req, res) => {
  try {
      console.log('Route - 1: Request received for projectId:', req.params.projectId);

      const project = await Project.findOne({ _id: req.params.projectId }).populate('rooms');
      console.log('Route - 2: Project retrieved:', project);

      if (!project) {
          console.log('Route - 3: Project not found');
          return res.status(401).json({ message: 'Project not found' });
      }

      const projectPlanning = taskSort(project);
      console.log('Route - 4: Project planning generated');

      res.status(200).json({ message: 'Project planning generated successfully', Planning: projectPlanning });
  } catch (error) {
      console.error('Route - 5: Error during generation', error);
      res.status(500).json({ message: 'Error during generation', error });
  }
});

 
//-----à refaire sans le token car il est deja dans le projet-------//
// /-----------------------------------------------Suppression d'un projet-------------------------------------------//

// router.delete("/deleteProject/:projectId", async (req, res) => {
//   try {

//     const project = await Project.findOne({ _id: req.params.projectId });

//     const user = await User.findOne({ token: req.body.token });

//     if (!(project && user)) {
//       return res.status(401).json({ message: 'Project or user not found' });
//     }

//     if (project.rooms.length) {

//       for (let i = 0; i < project.rooms.length; i++) {
//         await Room.deleteOne({ _id: project.rooms[i] });
//       }
//     }

//     const projectIndex = await user.projects.findIndex((project) => project.toString() === req.body.projectId);

//     if (projectIndex < 0) {
//       return res.status(401).json({ message: 'Project not found' });
//     }

//     user.projects.splice(projectIndex, 1);

//     await user.save();

//     await Project.deleteOne({ _id: req.body.projectId });

//     res.status(200).json({ message: 'Project deleted successfully', project: project });

//   } catch (error) {
//     res.status(500).json({ message: 'Error during deletion', error });
//   }
// });

 
//-------------------------------------------Ajout d'un artisan au projet------------------------------------//
router.put("/addArtisanToProject", async (req, res) => {
  try {

    const projectArtisan = {

      artisanId: req.body.artisanId,
      availability: req.body.availability,
      trustLevel: req.body.trustLevel,
      quote: req.body.quote,
      comment: req.body.comment

    }

    const artisan = await Artisan.findOne({ _id: req.body.artisanId });

    const project = await Project.findByIdAndUpdate({ _id: req.body.projectId }, { $push: { artisans: projectArtisan } }, { new: true, useFindAndModify: false });

    if (!project) {
      return res.status(401).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project updated successfully', project: project });
  } catch (error) {
    res.status(500).json({ message: 'Error during update', error });
  }
});

//---------------------------------------------Modification d'un artisan lié à un projet--------------------------------//
router.put("/editProjectArtisan", async (req, res) => {
  try {

    const project = await Project.findOne({ _id: req.body.projectId });

    if (!project) {
      return res.status(401).json({ message: 'Project not found' });
    }

    const index = await project.artisans.findIndex((artisan) => artisan.artisanId.toString() === req.body.artisanId);

    if (index < 0) {
      return res.status(401).json({ message: 'Artisan not found' });
    }

    project.artisans[index].availability = req.body.availability;
    project.artisans[index].trustLevel = req.body.trustLevel;
    project.artisans[index].quote = req.body.quote;
    project.artisans[index].comment = req.body.comment;

    await project.save();

    res.status(200).json({ message: 'Project updated successfully', project: project });
  } catch (error) {
    res.status(500).json({ message: 'Error during update', error });
  }
});


//------------------------------------------Suppression d'un artisan lié à un projet---------------------------------//
router.put("/removeArtisanFromProject", async (req, res) => {
  try {

    const project = await Project.findOne({ _id: req.body.projectId });

    if (!project) {
      return res.status(401).json({ message: 'Project not found' });
    }

    const artisanIndex = await project.artisans.findIndex((artisan) => artisan.artisanId.toString() === req.body.artisanId);

    if (artisanIndex < 0) {
      return res.status(402).json({ message: 'Artisan not found' });
    }

    await project.artisans.splice(artisanIndex, 1);

    await project.save();

    res.status(200).json({ message: 'Artisan removed successfully', project: project });
  } catch (error) {
    res.status(500).json({ message: 'Error during removal', error });
  }
});



//--------ROUTES NON UTILISÉES---------//

 

// //---------------Ajout d'une pièce à un projet-------------------------//
// router.put("/addRoomToProject", async (req, res) => {
//   try {

//     const project = await Project.findOne({ _id: req.body.projectId });

//     const room = await Room.findOne({ _id: req.body.roomId });

//     if (!project) {
//       return res.status(401).json({ message: 'Project not found' });
//     }

//     if (!room) {
//       return res.status(401).json({ message: 'Room not found' });
//     }

//     if (project.rooms.includes(req.body.roomId)) {
//       return res.status(401).json({ message: 'Room already added to project' });
//     }

//     project.rooms.push(req.body.roomId);

//     await project.save();

//     res.status(200).json({ message: 'Room added to project successfully', room: room });

//   } catch (error) {
//     res.status(500).json({ message: 'Error during update', error });
//   }
// });
//------Route qui retire une room d'un projet-------//
// router.put("/removeRoomFromProject/:projectId/:roomId", async (req, res) => {
//   try {

//       const project = await Project.findOne({ _id: req.params.projectId });
//       // console.log(project);

//       if (!project) {
//           return res.status(401).json({ message: 'Project not found' });
//       }

//       if (!project.rooms.length) {
//           return res.status(401).json({ message: 'No room found in project' });
//       }

//       const index = await project.rooms.findIndex((room) => room._id.toString() === req.params.roomId);
//       // console.log(project.rooms);
//       // console.log(req.params.roomId);

//       if (index < 0) {
//           return res.status(401).json({ message: 'Room not found' });
//       }

//       project.rooms.splice(index, 1);

//       await project.save();

//       res.status(200).json({ message: 'Room removed from project successfully', project: project });

//   } catch (error) {
//       res.status(500).json({ message: 'Error during update', error });
//   }
// });

module.exports = router;

