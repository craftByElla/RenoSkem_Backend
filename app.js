require("dotenv").config() // Lien .env (LIGNE 1 !!!)
require("./models/connection") // Fichier de connection à la BDD Mongoose

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users'); // Ajouter si vous voulez créer un nouveau fichier de route
var projectsRouter = require('./routes/projects');
var roomsRouter = require('./routes/rooms');
var skillsRouter = require('./routes/skills');
var artisansRouter = require('./routes/artisans');
var teammatesRouter = require('./routes/teammates');

var app = express();


const cors = require("cors") // Installation de Cors

const corsOptions = {
  origin: function (origin, callback) {
    // Remplacee 'allowedOrigins' avec vos différents URLs front pouvant accéder au Backend
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
    ];
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"],
};


app.use(cors(corsOptions)) // Installation de Cors
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter); // Ajouter si vous voulez créer un nouveau fichier de route
app.use('/projects', projectsRouter);
app.use('/rooms', roomsRouter);
app.use('/skills', skillsRouter);
app.use('/artisans', artisansRouter);
app.use('/teammates', teammatesRouter);


module.exports = app;
