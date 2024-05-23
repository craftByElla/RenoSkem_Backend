const express = require('express');
const router = express.Router();

require('../models/connection');
const Skills = require('../models/skills');

//const { checkBody } = require('../modules/checkBody');

/*
router.post('/setSkills', (req, res) => {
  if (!checkBody(req.body, [])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
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
            'Revêtement sol': req.body.revetementSol,
            'Revêtements extérieurs': req.body.revetementsExterieurs,
            'Toiture': req.body.toiture,
            'Ventilation': req.body.ventilation
        
      });

      newSkills.save().then(data => {
        res.json({ result: data});
      });
    })  */

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

    /*
    router.put("/editSkills/:id/:chauffage/:cloisonnementPlatrage/:demolition/:electricite/:etancheite/:facade/:fondations/:installationCuisineSDB/:isolation/:maconnerie/:menuiserie/:montageDeMeuble/:peinture/:plomberie/:revetementsMuraux/:revetementSol/:revetementsExterieurs/:toiture/:ventilation", (req, res) => { 
        Skills.findOne({_id: req.params.id}).then(data => {
            Skills.updateOne({_id: req.params.id},
                 {
                    
                'Chauffage': req.params.chauffage,
                'Cloisonnement/Plâtrage': req.params.cloisonnementPlatrage,
                'Démolition': req.params.demolition,
                'Électricité': req.params.electricite,
                'Étanchéité': req.params.etancheite,
                'Façade': req.params.facade,
                'Fondations': req.params.fondations,
                'Installation cuisine/SDB': req.params.installationCuisineSDB,
                'Isolation': req.params.isolation,
                'Maçonnerie': req.params.maconnerie,
                'Menuiserie': req.params.menuiserie,
                'Montage de meuble': req.params.montageDeMeuble,
                'Peinture': req.params.peinture,
                'Plomberie': req.params.plomberie,
                'Revêtements muraux': req.params.revetementsMuraux,
                'Revêtement sol': req.params.revetementSol,
                'Revêtements extérieurs': req.params.revetementsExterieurs,
                'Toiture': req.params.toiture,
                'Ventilation': req.params.ventilation
            }).then(
              res.json({ result: true})
            )
        })
      })
      */
    
      router.put("/editSkills/:id/:chauffage/:cloisonnementPlatrage/:demolition/:electricite/:etancheite/:facade/:fondations/:installationCuisineSDB/:isolation/:maconnerie/:menuiserie/:montageDeMeuble/:peinture/:plomberie/:revetementsMuraux/:revetementsSol/:revetementsExterieurs/:toiture/:ventilation", async (req, res) => {
        try {
          const skills = await Skills.findByIdAndUpdate({ _id: req.params.id }, {
                    
            'Chauffage': req.params.chauffage,
            'Cloisonnement/Plâtrage': req.params.cloisonnementPlatrage,
            'Démolition': req.params.demolition,
            'Électricité': req.params.electricite,
            'Étanchéité': req.params.etancheite,
            'Façade': req.params.facade,
            'Fondations': req.params.fondations,
            'Installation cuisine/SDB': req.params.installationCuisineSDB,  // problème avec le slash de 'Installation cuisine/SDB'  lorsque l'on fait une requête
            'Isolation': req.params.isolation,
            'Maçonnerie': req.params.maconnerie,
            'Menuiserie': req.params.menuiserie,
            'Montage de meuble': req.params.montageDeMeuble,
            'Peinture': req.params.peinture,
            'Plomberie': req.params.plomberie,
            'Revêtements muraux': req.params.revetementsMuraux,
            'Revêtements sol': req.params.revetementsSol,
            'Revêtements extérieurs': req.params.revetementsExterieurs,
            'Toiture': req.params.toiture,
            'Ventilation': req.params.ventilation
        }, {new: true});
      
          if (!skills) {
            return res.status(401).json({ message: 'Skills not found' });
          }
        
          res.status(200).json({ message: 'Skills updated successfully', skills: skills });
        } catch (error) {
          res.status(500).json({ message: 'Error during update', error });
        }
      });
  

    router.get("/getSkills/:id", async (req, res) => {
        try {
          const skills = await Skills.findOne({ _id: req.params.id });
      
          if (!skills) {
            return res.status(401).json({ message: 'Skills not found' });
          }
      
          res.status(200).json({ message: 'Skills found', skills: skills });
        } catch (error) {
          res.status(500).json({ message: 'Error during search', error });
        }
      });
  


router.delete("/deleteSkills/:id", async (req, res) => {
    try {
      const skills = await Skills.findByIdAndDelete({ _id: req.params.id });
  
      if (!skills) {
        return res.status(401).json({ message: 'Skills not found' });
      }
  
      res.status(200).json({ message: 'Skills deleted successfully', skills: skills });
    } catch (error) {
      res.status(500).json({ message: 'Error during deletion', error });
    }
  });


module.exports = router;

