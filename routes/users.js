const express = require('express');
const router = express.Router();
//const User = require('../models/User'); // Importe le modèle User
const bcrypt = require('bcryptjs'); // Pour le hachage des mots de passe
const jwt = require('jsonwebtoken'); // Pour la génération de tokens JWT
const uid2 = require('uid2'); // Pour générer un token unique lors de l'inscription
const secret_key_JWT = process.env.JWT_SECRET_KEY;

require('../models/connection');
const User = require('../models/user');
const Skills = require('../models/skills')

//--------GET USER---------// récupère les infos d'un utilisateur
router.get("/getUser/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).populate('skills');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    res.status(200).json({ message: 'User found', user: user });
  } 
  catch (error) {
    res.status(500).json({ message: 'Error during search', error });
  }
});



    router.put("/editUSer/:id/:name/:avatar/", async (req, res) => {
      try {
        //const user = await User.findOne({ _id: req.params.id });
        const user = await User.findByIdAndUpdate({ _id: req.params.id }, { name: req.params.name, avatar: req.params.avatar }, {new: true});
    
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }

        //await User.updateOne({ _id: req.params.id }, { name: req.params.name, avatar: req.params.avatar });
    
        res.status(200).json({ message: 'User profile updated successfully', user: user });
      } catch (error) {
        res.status(500).json({ message: 'Error during update', error });
      }
    });



    router.put("/changePassword/:id/:password/", async (req, res) => {
      try {
        const user = await User.findByIdAndUpdate({ _id: req.params.id }, {password: bcrypt.hash(req.params.password, 10)}, {new: true});
    
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }

        //User.updateOne({_id: req.params.id}, {password: bcrypt.hash(req.params.password, 10)});
    
        res.status(200).json({ message: 'Password changed successfully', user: user });
      } catch (error) {
        res.status(500).json({ message: 'Error during password change', error });
      }
    });



    router.put("/changeEmail/:id/:email/", async (req, res) => {
      try {
        const user = await User.findByIdAndUpdate({ _id: req.params.id }, {email: req.params.email}, {new: true});

        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }

       // await User.updateOne({_id: req.params.id}, {email: req.params.email});
    
        res.status(200).json({ message: 'Email changed successfully', user: user });
      } catch (error) {
        res.status(500).json({ message: 'Error during email change', error });
      }
    });



  router.delete("/deleteUser/:id", async (req, res) => {
    try {
      const user = await User.findByIdAndDelete({ _id: req.params.id });
  
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      //await User.deleteOne({_id: req.params.id});
  
      res.status(200).json({ message: 'User account deleted successfully', user: user });
    } catch (error) {
      res.status(500).json({ message: 'Error during deletion', error });
    }
  });
  



//----ROUTE INSCRIPTION UTILISATEUR-----------//
router.post('/signup', async (req, res) => {
  try {
    console.log('Requête reçue avec les données:', req.body);

    // Vérifiez que tous les champs requis sont présents
    const { name, email, password, avatar, skills } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }

    // Hachage du mot de passe reçu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création du nouvel utilisateur avec un token unique
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      avatar,
      skills, // Assurez-vous que c'est correctement configuré dans votre modèle
      token: uid2(32), // Génère un token unique de 32 caractères
    });

    // Sauvegarde de l'utilisateur dans la base de données
    await newUser.save();

    // Réponse avec le résultat
    res.status(201).json({ message: 'User successfully registered', user: newUser });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.email) {
      console.error('Duplicate email error:', error);
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    console.error('Erreur lors de l\'inscription de l\'utilisateur:', error);
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

    // Génération d'un JWT si l'authentification est réussie
    const token = jwt.sign({ id: user._id }, secret_key_JWT);

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
router.post('/logout', (req, res) => {
  // Supposer que le client supprime le token en appuyant sur logout on supprimerait le token du localstorage
  res.status(200).json({ message: 'Logged out successfully' });
});


//----------ROUTE ADDSKILLS-----// Permet de lier un ensemble de compétence à un utilisateur
 

router.put("/addSkills/:userId/:skillsId/", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    const skills = await Skills.findOne({ _id: req.params.skillsId });

    if (!(user && skills)) {
      return res.status(401).json({ message: 'User or skills not found' });
    }

    await User.updateOne({_id: req.params.userId}, {skills: req.params.skillsId});

    res.status(200).json({ message: 'Skills added successfully', user: user });
  } catch (error) {
    res.status(500).json({ message: 'Error during skills addition', error });
  }
});

module.exports = router;