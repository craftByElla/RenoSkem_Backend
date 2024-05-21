const express = require('express');
const router = express.Router();

require('../models/connection');
const Room = require('../models/room');



router.post('/newRoom', async (req, res) => {
  try {
    const newRoom = new Room({
      
        type: req.body.type,
        name: req.body.name,
        items: req.body.items,
        surface: req.body.surface,
        comment: req.body.comment,
        project: req.body.project

    });

    await newRoom.save();

    res.status(201).json({ message: 'Room successfully added', room: newRoom });
  } catch (error) {
    res.status(500).json({ message: 'Error saving room', error });
  }
});



router.put("/addItem/:id/:field/:difficulty", async (req, res) => {
    try {

        const item = {
  
            _id: new mongoose.Types.ObjectId(),
            field: req.params.field, 							
            difficulty: req.params.difficulty, 
            diy: true,
            artisan: null,        
            teammates: null,
        }; 

        const artisan = await Room.findByIdAndUpdate({ _id: req.params.id }, { $push: { items: item } }, {new: true, useFindAndModify: false});
  
      if (!artisan) {
        return res.status(401).json({ message: 'Room not found' });
      }

      res.status(200).json({ message: 'Room updated successfully', artisan: artisan });
    } catch (error) {
      res.status(500).json({ message: 'Error during update', error });
    }
  });


  router.put("/removeItem/:id/:itemId", async (req, res) => {
    try {

        const room = await Room.findByIdAndUpdate({ _id: req.params.id }, { $pull: { items: req.params.itemId } }, {new: true, useFindAndModify: false});
  
      if (!room) {
        return res.status(401).json({ message: 'Room not found' });
      }

      res.status(200).json({ message: 'Room updated successfully', artisan: artisan });
    } catch (error) {
      res.status(500).json({ message: 'Error during update', error });
    }
  });


  router.put("/assignItemToTeamate/:id/:itemId", async (req, res) => {
    try {

       // const artisan = await Room.findByIdAndUpdate({ _id: req.params.id }, { $pull: { items: req.params.itemId } }, {new: true, useFindAndModify: false});

        const room = await Room.findOne({ _id: req.params.id });

      if (!room) {
        return res.status(401).json({ message: 'Room not found' });
      }

      index = room.items.findIndex((item) => item._id = req.params.itemId);

      

      res.status(200).json({ message: 'Room updated successfully', artisan: artisan });
    } catch (error) {
      res.status(500).json({ message: 'Error during update', error });
    }
  });



    router.get("/getRoom/:id", async (req, res) => {
      try {
        const room = await Room.findOne({ _id: req.params.id });
    
        if (!room) {
          return res.status(401).json({ message: 'Room not found' });
        }
    
        res.status(200).json({ message: 'Room found', room: room });
      } catch (error) {
        res.status(500).json({ message: 'Error during search', error });
      }
    });



    router.put("/editRoom/:id/:type/:name/:items/:surface/:comment/:project", async (req, res) => {
      try {
        const room = await Room.findByIdAndUpdate({ _id: req.params.id }, {
          type: req.params.type,
          name: req.params.name,
          items: req.params.items,
          surface: req.params.surface,
          comment: req.params.comment,
          project: req.params.project
            }, {new: true});
    
        if (!room) {
          return res.status(401).json({ message: 'Room not found' });
        }
    
        res.status(200).json({ message: 'Room updated successfully', room: room });
      } catch (error) {
        res.status(500).json({ message: 'Error during update', error });
      }
    });



  router.delete("/deleteRoom/:id", async (req, res) => {
    try {
      const room = await Room.findByIdAndDelete({ _id: req.params.id });
  
      if (!room) {
        return res.status(401).json({ message: 'Room not found' });
      }
  
      res.status(200).json({ message: 'Room deleted successfully', room: room });
    } catch (error) {
      res.status(500).json({ message: 'Error during deletion', error });
    }
  });
  


module.exports = router;

