const express = require('express');
const router = express.Router();
//const User = require('../models/User'); // Importe le modèle User
const bcrypt = require('bcryptjs'); // Pour le hachage des mots de passe
const jwt = require('jsonwebtoken'); // Pour la génération de tokens JWT
const uid2 = require('uid2'); // Pour générer un token unique lors de l'inscription
// const secret_key_JWT = process.env.JWT_SECRET_KEY; //Pas utilisé finalement

require('../models/connection');
const User = require('../models/user');
const Skills = require('../models/skills');

//-------récupère un profil utilisateur via le token de connexion-----//
    router.get("/getUser/:token", async (req, res) => {
      try {
        const user = await User.findOne({ token: req.params.token }).populate('skills');
    
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }
    
        res.status(200).json({ message: 'User found', user: user });
      } catch (error) {
        res.status(500).json({ message: 'Error during search', error });
      }
    });

//------doublon qui est utilisé donc ne pas supprimer----//
    router.get("/getUserByToken/:token", async (req, res) => {
      try {
        const user = await User.findOne({ token: req.params.token }).populate('skills');
    
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }
    
        res.status(200).json({ message: 'User found', user: user });
      } catch (error) {
        res.status(500).json({ message: 'Error during search', error });
      }
    });

//-------Modifie les infos du user-----------/
router.put("/editUser/:token", async (req, res) => {
    try {

      const user = await User.findOne({ token: req.params.token });
      console.log('user', user)
  if (!user) {
    return res.status(402).json({ message: 'User not found' });
  }

  else if(req.body.currentPassword){
      if (!(await bcrypt.compare(req.body.currentPassword, user.password))) {
          return res.status(401).json({ message: 'Password incorrect' });
      } else {
          const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
          await User.updateOne({ token: req.params.token }, { name: req.body.name, password: hashedPassword, avatar: req.body.avatar ? `avatar/${req.body.avatar}` : null }, {new: true});
        }
  } else {
          await User.updateOne({ token: req.params.token }, { name: req.body.name, avatar: req.body.avatar ? `avatar/${req.body.avatar}` : null  }, {new: true})
  }

  res.status(200).json({ message: 'User profile updated successfully', user: user });
  } catch (error) {
  res.status(500).json({ message: 'Error during update', error });
  }
});

//---------LIE LES SKILLS A UN USER----------//
router.put("/addSkillsToUser/:token/:skillsId/", async (req, res) => {
  try {
    const user = await User.findOne({ token: req.params.token });
    const skills = await Skills.findOne({ _id: req.params.skillsId });

    if (!(user && skills)) {
      return res.status(401).json({ message: 'User or skills not found' });
    }

    await User.updateOne({token: req.params.token}, {skills: req.params.skillsId}, {new: true});

    res.status(200).json({ message: 'Skills added successfully', user: user });
  } catch (error) {
    res.status(500).json({ message: 'Error during addition', error });
  }
});


router.put("/addskillstouser", async (req, res) => {
  try {

    const user = await User.findOne({ token: req.body.token });

    const skills = await Skills.findOne({ _id: req.body.skillsId });

    if (!(user && skills)) {

      return res.status(401).json({ message: 'User or skills not found' });

    }

    await User.updateOne({ token: req.body.token }, { skills: req.body.skillsId }, { new: true });

    res.status(200).json({ message: 'Skills added successfully', user: user });
  } catch (error) {
    res.status(500).json({ message: 'Error during addition', error });
  }
});

//---------SUPPRIME UN UTILISATEUR----------------// à mettre à jour
router.delete("/deleteUserAccount/:token", async (req, res) => {
  try {

    const user = await User.findOne({ token: req.params.token }).populate('projects');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const projects = user.projects;

    if (projects.length) {

      for (let i = 0; i < projects.length; i++) {

        const project = projects[i];

        if (project.rooms.length) {

          for (let j = 0; j < project.rooms.length; j++) {

            await Room.deleteOne({ _id: project.rooms[j] });

          }

        }

        await Project.deleteOne({ _id: project._id });

      }

    }

    for (let i = 0; i < user.teammates; i++) {

      await Teammate.deleteOne({ _id: user.teammates[i] });

    }

    for (let i = 0; i < user.artisans; i++) {

      await Artisan.deleteOne({ _id: user.artisans[i] });

    }

    await User.deleteOne({ _id: user._id });

    res.status(200).json({ message: 'Room removed from project successfully', project: project });

  } catch (error) {
    res.status(500).json({ message: 'Error during update', error });
  }
});

//----ROUTE INSCRIPTION UTILISATEUR-----------//
router.post('/signup', async (req, res) => {
  try {
    // Hachage du mot de passe reçu
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Création du nouvel utilisateur avec un token unique
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      avatar: req.body.avatar ? `avatar/${req.body.avatar}` : null, //Stockage du chemin relatif de l'avatar et non l'URL complète
      skills: req.body.skills, 
      token: uid2(32), // Génère un token unique de 32 caractères
    });

    // Sauvegarde de l'utilisateur dans la base de données
    await newUser.save();

    // Réponse avec le résultat
    res.status(201).json({ message: 'User successfully registered', user: newUser });
  } catch (error) {
    // Gestion des erreurs
    res.status(500).json({ message: 'Error registering user', error });
  }
});

//----ROUTE CONNEXION UTILISATEUR-----------//
router.post('/login', async (req, res) => {
  try {
    // Recherche de l'utilisateur par son nom email
    const user = await User.findOne({ email: req.body.email });

    // Si l'utilisateur n'existe pas
    if (!user) {
      return res.status(401).json({ message: 'No user found with this email' });
    }

    // Si le mot de passe n'est pas correct
    if (!(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ message: 'Password incorrect' });
    }

  // Génération d'un token unique si l'authentification est réussie
  const token = uid2(32);
  // console.log('Generated token:', token);

  // Mise à jour du token dans le backend
  user.token = token;
  await user.save();
    
    // Réponse avec le token JWT
    res.json({ message: 'Login successful', token: token, name: user.name });
  } catch (error) {
    // Gestion des erreurs
    res.status(500).json({ message: 'Error during login', error });
  }
});

//-------ROUTE LOGOUT-----//
router.get('/logout', (req, res) => {
  // Supposer que le client supprime le token en appuyant sur logout on supprimerait le token du localstorage
  res.status(200).json({ message: 'Logged out successfully' });
});

//-------ROUTES NON UTILISEES POUR LINSTANT---------//
//-----------Récupération des projets d'un utilisateur----------------//
// router.get("/getUserProjects/:token", async (req, res) => {
//   try {

//     const user = await User.findOne({ token: req.params.token });

//     if (!user) {

//       return res.status(401).json({ message: 'User not found' });

//     }

//     if (!user.projects.length) {

//       return res.status(401).json({ message: 'No project found' });

//     }

//     res.status(200).json({ message: 'Projects found', projects: user.projects });
//   } catch (error) {
//     res.status(500).json({ message: 'Error during search', error });
//   }
// });

//----------------Récupération des coéquipiers d'un utilisateur----------------//
router.get("/getUserTeammates/:token", async (req, res) => {
  try {

    const user = await User.findOne({ token: req.params.token }).populate('teammates');

    if (!user) {

      return res.status(401).json({ message: 'User not found' });

    }

    if (!user.teammates.length) {

      return res.status(401).json({ message: 'No teammate found' });

    }

    res.status(200).json({ message: 'Teammates found', teammates: user.teammates });
  } catch (error) {
    res.status(500).json({ message: 'Error during search', error });
  }
});

// //-----------------------Récupération des artisans d'un utilisateur-----------------//
 router.get("/getUserArtisans/:token", async (req, res) => {
   try {

     const user = await User.findOne({ token: req.params.token }).populate('artisans');

     if (!user) {

       return res.status(401).json({ message: 'User not found' });

     }

     if (!user.artisans.length) {

       return res.status(401).json({ message: 'No artisan found' });

     }

    res.status(200).json({ message: 'Artisans found', artisans: user.artisans });
  } catch (error) {
    res.status(500).json({ message: 'Error during search', error });
  }
 });

// //-----------Récupération des projets d'un utilisateur selon un domaine d'activité--------------//
// router.get("/getUserArtisansByField/:token", async (req, res) => {
//   try {

//     const user = await User.findOne({ token: req.params.token }).populate('artisans');

//     if (!user) {

//       return res.status(401).json({ message: 'User not found' });

//     }

//     if (!user.artisans.length) {

//       return res.status(401).json({ message: 'No artisan found' });

//     }

//     const artisans = user.artisans.filter(artisan => artisan.field === req.body.field);

//     res.status(200).json({ message: 'Artisan(s) found', artisans: artisans });
//   } catch (error) {
//     res.status(500).json({ message: 'Error during search', error });
//   }

// });


module.exports = router;

