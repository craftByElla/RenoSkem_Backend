const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
	emailUser:String,
	job: String,
	campagnyName: String,
	disponibility: Date,                                           // model de l'artisant
	confianceLevel: Number,
	devis:Number,
	comment:String,
});

const Contact = mongoose.model('contacts', contactSchema);

module.exports = Contact;
