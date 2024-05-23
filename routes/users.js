const express = require('express');
const router = express.Router();
//const User = require('../models/User'); // Importe le modèle User
const bcrypt = require('bcryptjs'); // Pour le hachage des mots de passe
const jwt = require('jsonwebtoken'); // Pour la génération de tokens JWT
const uid2 = require('uid2'); // Pour générer un token unique lors de l'inscription
const secret_key_JWT = process.env.JWT_SECRET_KEY;

require('../models/connection');
const User = require('../models/user');
const Skills = require('../models/skills');


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



    router.put("/editUSer/:token/:name/:avatar/", async (req, res) => {
      try {
        //const user = await User.findOne({ _id: req.params.id });
        const user = await User.findByIdAndUpdate({ token: req.params.token }, { name: req.params.name, avatar: req.params.avatar }, {new: true});
    
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }

        //await User.updateOne({ _id: req.params.id }, { name: req.params.name, avatar: req.params.avatar });
    
        res.status(200).json({ message: 'User profile updated successfully', user: user });
      } catch (error) {
        res.status(500).json({ message: 'Error during update', error });
      }
    });



    router.put("/changePassword/:token/:password/", async (req, res) => {
      try {
        const user = await User.findByIdAndUpdate({ token: req.params.token }, {password: bcrypt.hash(req.params.password, 10)}, {new: true});
    
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }

        //User.updateOne({_id: req.params.id}, {password: bcrypt.hash(req.params.password, 10)});
    
        res.status(200).json({ message: 'Password changed successfully', user: user });
      } catch (error) {
        res.status(500).json({ message: 'Error during password change', error });
      }
    });



    router.put("/changeEmail/:token/:email/", async (req, res) => {
      try {
        const user = await User.findByIdAndUpdate({ token: req.params.token }, {email: req.params.email}, {new: true});

        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }

       // await User.updateOne({_id: req.params.id}, {email: req.params.email});
    
        res.status(200).json({ message: 'Skills added to user successfully', user: user });
      } catch (error) {
        res.status(500).json({ message: 'Error during addition', error });
      }
    });




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

  router.delete("/deleteUser/:token", async (req, res) => {
    try {
      const user = await User.findByIdAndDelete({ token: req.params.token });
  
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
    // Hachage du mot de passe reçu
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Création du nouvel utilisateur avec un token unique
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      avatar: req.body.avatar,
      skills: req.body.skills, //pas sur que c'est comme ça qu'on appelle la clé étrangère ?
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
    console.log('Received login request with body:', req.body);

    // Recherche de l'utilisateur par son email
    const user = await User.findOne({ email: req.body.email });

    // Si l'utilisateur n'existe pas
    if (!user) {
      console.log('No user found with this email');
      return res.status(401).json({ message: 'No user found with this email' });
    }

    // Si le mot de passe n'est pas correct
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      console.log('Password incorrect');
      return res.status(401).json({ message: 'Password incorrect' });
    }

    // Génération d'un token unique si l'authentification est réussie
    const token = uid2(32);
    console.log('Generated token:', token);

    // Mise à jour du token dans le backend
    user.token = token;
    await user.save();
    
    // Réponse avec le token unique
    res.json({ message: 'Login successful', token: token, name: user.name });
  } catch (error) {
    // Gestion des erreurs
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login', error });
  }
});




//-------ROUTE LOGOUT-----//
router.post('/logout', (req, res) => {
  // Supposer que le client supprime le token en appuyant sur logout on supprimerait le token du localstorage
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;

