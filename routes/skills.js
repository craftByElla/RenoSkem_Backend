const express = require('express');
const router = express.Router();

require('../models/connection');
const Skills = require('../models/skills');

const get_idSkillsWithTokenUSerMiddleware  = require('../modules/get_idSkillsWithTokenUSerMiddleware')

//----------Crée un set de skills-------------//
    router.post('/setSkills', async (req, res) => {
        try {   
    
          const newSkills = new Skills({
        
            'Chauffage': req.body.chauffage,
            'Cloisonnement/Plâtrage': req.body.cloisonnementPlatrage,
            'Démolition': req.body.demolition,
            'Électricité': req.body.electricite,
            'Étanchéité': req.body.etancheite,
            'Façade': req.body.facade,
            'Fondations': req.body.fondations,
            'Installation cuisine/SDB': req.body.installationCuisineSDB,
            'Isolation': req.body.isolation,
            'Maçonnerie': req.body.maconnerie,
            'Menuiserie': req.body.menuiserie,
            'Montage de meuble': req.body.montageDeMeuble,
            'Peinture': req.body.peinture,
            'Plomberie': req.body.plomberie,
            'Revêtements muraux': req.body.revetementsMuraux,
            'Revêtements sol': req.body.revetementsSol,
            'Revêtements extérieurs': req.body.revetementsExterieurs,
            'Toiture': req.body.toiture,
            'Ventilation': req.body.ventilation
        
      });

          await newSkills.save();

          res.status(201).json({ message: 'Skills saved successfully', skills: newSkills });
        } catch (error) {
          res.status(500).json({ message: 'Error saving skillset', error });
        }
      });

//-----------Met à jour un set de skills----------//
      router.put("/editSkills/:token/", (get_idSkillsWithTokenUSerMiddleware), async (req, res) => {
        try {
          console.log(req.body)
          console.log('req.skillsId', req.skillsId)
          const skills = await Skills.findByIdAndUpdate({ _id: req.skillsId }, {
                    
            'Chauffage': req.body.chauffage,
            'Cloisonnement/Plâtrage': req.body.cloisonnementPlatrage,
            'Démolition': req.body.demolition,
            'Électricité': req.body.electricite,
            'Étanchéité': req.body.etancheite,
            'Façade': req.body.facade,
            'Fondations': req.body.fondations,
            'Installation cuisine/SDB': req.body.installationCuisineSDB,
            'Isolation': req.body.isolation,
            'Maçonnerie': req.body.maconnerie,
            'Menuiserie': req.body.menuiserie,
            'Montage de meuble': req.body.montageDeMeuble,
            'Peinture': req.body.peinture,
            'Plomberie': req.body.plomberie,
            'Revêtements muraux': req.body.revetementsMuraux,
            'Revêtements sol': req.body.revetementsSol,
            'Revêtements extérieurs': req.body.revetementsExterieurs,
            'Toiture': req.body.toiture,
            'Ventilation': req.body.ventilation
        }, {new: true});
      
          if (!skills) {
            return res.status(401).json({ message: 'Skills not found' });
          }
        
          res.status(200).json({ message: 'Skills updated successfully', skills: skills });
        } catch (error) {
          res.status(500).json({ message: 'Error during update', error });
        }
      });
  



  //------ROUTES NON UTILISEES---------//
  // router.get("/getSkills/:id", async (req, res) => {
  //   try {
  //     const skills = await Skills.findOne({ _id: req.params.id });
  
  //     if (!skills) {
  //       return res.status(401).json({ message: 'Skills not found' });
  //     }
  
  //     res.status(200).json({ message: 'Skills found', skills: skills });
  //   } catch (error) {
  //     res.status(500).json({ message: 'Error during search', error });
  //   }
  // });


// router.delete("/deleteSkills/:id", async (req, res) => {
//   try {
//     const skills = await Skills.findByIdAndDelete({ _id: req.params.id });

//     if (!skills) {
//       return res.status(401).json({ message: 'Skills not found' });
//     }

//     res.status(200).json({ message: 'Skills deleted successfully', skills: skills });
//   } catch (error) {
//     res.status(500).json({ message: 'Error during deletion', error });
//   }
// });

module.exports = router;

