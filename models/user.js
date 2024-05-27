const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},                                                  
    avatar: { type: String, default: ''},
    skills: {type: mongoose.Schema.Types.ObjectId, ref:'skills', default: null},
    projects: { type: [{type: mongoose.Schema.Types.ObjectId, ref:'projects'}], default: []}, 
    teammates: { type: [{type: mongoose.Schema.Types.ObjectId, ref:'teammates'}], default: []}, 
    artisans: { type: [{type: mongoose.Schema.Types.ObjectId, ref:'artisans'}], default: []}, 
    token: {type: String, required: true, unique: true}
});

const User = mongoose.model('users', userSchema);

module.exports = User;

