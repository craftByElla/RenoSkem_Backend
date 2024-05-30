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


//---------SUPPRIME UN UTILISATEUR----------------//

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




router.get("/getUserArtisansByField", async (req, res) => {
  try {

    const user = await User.findOne({ token: req.body.token }).populate('artisans');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.artisans.length) {
      return res.status(401).json({ message: 'No artisan found' });
    }

    const artisans = user.artisans.filter(artisan => artisan.field === req.body.field);

    res.status(200).json({ message: 'Artisan(s) found', artisans: artisans });
  } catch (error) {
    res.status(500).json({ message: 'Error during search', error });
  }

});

router.get("/getUserProjects/:token", async (req, res) => {
  try {
const user = await User.findOne({ token: req.params.token });

if (!user) {

  return res.status(401).json({ message: 'User not found' });

}

if (!user.projects.length) {

  return res.status(401).json({ message: 'No project found' });

}

res.status(200).json({ message: 'Projects found', projects: user.projects });
  } catch (error) {
    res.status(500).json({ message: 'Error during search', error });
  }
});

module.exports = router;

