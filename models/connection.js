const mongoose = require('mongoose');

const connectionString = process.env.CONNECTION_STRING;

mongoose.connect(connectionString, {
  connectTimeoutMS: 2000 // Définit un délai de connexion de 2000 ms.
})
.then(() => console.log('Database connected 💪'))
.catch(error => console.error('Failed to connect to the database', error));
