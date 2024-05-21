const express = require('express');
const router = express.Router();
//const User = require('../models/User'); // Importe le modèle User
const bcrypt = require('bcryptjs'); // Pour le hachage des mots de passe
const jwt = require('jsonwebtoken'); // Pour la génération de tokens JWT
const uid2 = require('uid2'); // Pour générer un token unique lors de l'inscription
const secret_key_JWT = process.env.JWT_SECRET_KEY;

require('../models/connection');
const User = require('../models/user');

//const { checkBody } = require('../modules/checkBody');

/*
router.post('/postUser', (req, res) => {
  if (!checkBody(req.body, ['name', 'email', 'password', 'skills'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar,
        skills: req.body.skills
      });

      newUser.save().then(data => {
        res.json({ result: data});
      });
    })

    
    router.get("/getUser/:id", (req, res) => { 
      User.findOne({_id: req.params.id}).populate('skills').then(data => {
        res.json({ result: data });
      });
    });
    
*/
    router.get("/getUser/:id", async (req, res) => {
      try {
        const user = await User.findOne({ _id: req.params.id }).populate('skills');
    
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }
    
        res.status(200).json({ message: 'User found', user: user });
      } catch (error) {
        res.status(500).json({ message: 'Error during search', error });
      }
    });

/*

    router.put("/editUser/:id/:name/:avatar", (req, res) => { 
      User.findOne({_id: req.params.id}).then(data => {
        User.updateOne({_id: req.params.id},
               {
                name: req.params.name,
                email: req.params.email,
                password: bcrypt.hash(req.params.password, 10),
                avatar: req.params.avatar,
                skills: req.params.skills
          }).then(
            res.json({ result: true})
          )
      })
    })

    */

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

/*
    router.put("/changePassword/:id/:password/", (req, res) => { 
      User.findOne({_id: req.params.id}).then(data => {
        User.updateOne({_id: req.params.id}, {password: bcrypt.hash(req.params.password, 10)})
          .then(
            res.json({ result: true})
          )
      })
    })


    router.put("/changePassword/:id/:password/", (req, res) => { 
      if(User.findOne({ _id: req.params.id })){
        User.updateOne({_id: req.params.id}, {password: bcrypt.hash(req.params.password, 10)})
          .then(
            res.json({ message: 'Password changed successfully' })
          )
      } else {
        res.json({ message: 'User not found' })
      }
    })
*/

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


    router.put("/addSkills/:userId/:skillsId/", async (req, res) => {
      try {
        const user = await User.findOne({ _id: req.params.userId });
        const skills = await Skills.findOne({ _id: req.params.skillsId });
    
        if (!(user && skills)) {
          return res.status(401).json({ message: 'User or skills not found' });
        }

        await User.updateOne({_id: req.params.userId}, {skills: req.params.skillsId});
    
        res.status(200).json({ message: 'Skills added to user successfully', user: user });
      } catch (error) {
        res.status(500).json({ message: 'Error during addition change', error });
      }
    });




/*
    router.put("/changeEmail/:id/:email/", (req, res) => {  // vérifier que le mail n'est pas déjà utilisé qqpart ds la DB ?
      User.findOne({_id: req.params.id}).then(() => {
          User.updateOne({_id: req.params.id}, {email: req.params.email})
          .then(
            res.json({ result: true})
          )
      })
    })
*/

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

/*
router.delete("/deleteUser/:id", (req, res) => { 
  User.findOne({_id: req.params.id}).then(data => {
    User.deleteOne(data).then(
          res.json({ result: true})
        )
    })
  })
*/


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
    // Recherche de l'utilisateur par son nom d'utilisateur
    const user = await User.findOne({ name: req.body.name });

    // Si l'utilisateur n'existe pas ou le mot de passe ne correspond pas
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Génération d'un JWT si l'authentification est réussie
    const token = jwt.sign({ id: user._id }, secret_key_JWT);

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

module.exports = router;

