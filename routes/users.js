const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Importe le modèle User
const bcrypt = require('bcryptjs'); // Pour le hachage des mots de passe
const jwt = require('jsonwebtoken'); // Pour la génération de tokens JWT
const uid2 = require('uid2'); // Pour générer un token unique lors de l'inscription
const secret_key_JWT = process.env.JWT_SECRET_KEY;

//----ROUTE INSCRIPTION UTILISATEUR-----------//
router.post('/signup', async (req, res) => {
  try {
    // Hachage du mot de passe reçu
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Création du nouvel utilisateur avec un token unique
    const newUser = new User({
      username: req.body.username,
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
    // Recherche de l'utilisateur par son nom d'utilisateur
    const user = await User.findOne({ username: req.body.username });

    // Si l'utilisateur n'existe pas ou le mot de passe ne correspond pas
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Génération d'un JWT si l'authentification est réussie
    const token = jwt.sign({ id: user._id }, secret_key_JWT);

    // Réponse avec le token JWT
    res.json({ message: 'Login successful', token: token, username: user.username });
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
