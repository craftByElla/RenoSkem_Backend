const express = require('express');
const router = express.Router();

require('../models/connection');
const Room = require('../models/room');
const Teammate = require('../models/teammate');
const Artisan = require('../models/artisan');
const uid2 = require('uid2');



router.post('/newRoom', async (req, res) => {
    try {
        const newRoom = new Room({

            type: req.body.type,
           // name: req.body.name,
            //items: req.body.items,
            //surface: req.body.surface,
            //comment: req.body.comment,
            //project: req.body.project

        });

        await newRoom.save();

        res.status(201).json({ message: 'Room successfully added', room: newRoom });
    } catch (error) {
        res.status(500).json({ message: 'Error saving room', error });
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

/*
router.put("/editRoom/:id/:name/:surface/:comment", async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate({ _id: req.params.id }, {
            name: req.params.name,
            surface: req.params.surface,
            comment: req.params.comment
        }, { new: true });

        if (!room) {
            return res.status(401).json({ message: 'Room not found' });
        }

        res.status(200).json({ message: 'Room updated successfully', room: room });
    } catch (error) {
        res.status(500).json({ message: 'Error during update', error });
    }
});*/


router.put("/changeRoomName/:id/:name", async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate({ _id: req.params.id }, {
            name: req.params.name,
        }, { new: true });

        if (!room) {
            return res.status(401).json({ message: 'Room not found' });
        }

        res.status(200).json({ message: 'Room name changed successfully', room: room });
    } catch (error) {
        res.status(500).json({ message: 'Error during update', error });
    }
});


router.put("/setRoomSurface/:id/:surface", async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate({ _id: req.params.id }, {
            surface: req.params.surface,
        }, { new: true });

        if (!room) {
            return res.status(401).json({ message: 'Room not found' });
        }

        res.status(200).json({ message: 'Room surface updated successfully', room: room });
    } catch (error) {
        res.status(500).json({ message: 'Error during update', error });
    }
});


router.put("/addCommentToRoom/:id/:comment", async (req, res) => {
    try {

        console.log('totooo',req.params.comment);
        const room = await Room.findByIdAndUpdate({ _id: req.params.id }, {
            comment: req.params.comment
        }, { new: true });

        if (!room) {
            return res.status(401).json({ message: 'Room not found' });
        }

        res.status(200).json({ message: 'Comment added successfully', room: room });
    } catch (error) {
        res.status(500).json({ message: 'Error during addition', error });
    }
});


 



router.put("/removeItemFromRoom/:roomId/:itemId", async (req, res) => {
    try {

        const room = await Room.findOne({ _id: req.params.roomId });
       
        if (!room) {
            return res.status(401).json({ message: 'Room not found' });
        }

        const index = await room.items.findIndex((item) => item.id === req.params.itemId);

        if (index < 0) {
            return res.status(401).json({ message: 'Item not found' });
        }

        const item = room.items[index];

        for(let i = 0; i < item.teammates.length; i++){
            const teammate = await Teammate.findOne({ _id: item.teammates[i] });
            const index = await teammate.items.findIndex((e) => e.id === item.id);
            teammate.items.splice(index, 1);
            await teammate.save();
        }

        await room.items.splice(index, 1);

        await room.save();

        res.status(200).json({ message: 'Item removed from room successfully', room: room });


    } catch (error) {
        res.status(500).json({ message: 'Error during update', error });
    }
});


router.put("/assignItemToTeammate/:roomId/:itemId/:teammateId", async (req, res) => {
    try {

        const room = await Room.findOne({ _id: req.params.roomId });
        const teammate = await Teammate.findOne({ _id: req.params.teammateId });

        if (!room) {
            return res.status(401).json({ message: 'Room not found' });
        }

        if (!teammate) {
            return res.status(401).json({ message: 'Teammate not found' });
        }

        const index = await room.items.findIndex((item) => item.id === req.params.itemId);

        if (index < 0) {
            return res.status(401).json({ message: 'Item not found' });
        }

        const item = room.items[index];

        if (item.teammates.includes(req.params.teammateId) || teammate.items.includes(req.params.itemId)) {
            return res.status(401).json({ message: 'Item already assigned to teammate' });
        }

        await item.teammates.push(req.params.teammateId);

        await teammate.items.push(req.params.itemId);

        await room.save();

        await teammate.save();

        res.status(200).json({ message: 'Item assigned to teammate successfully', room: room });


    } catch (error) {
        res.status(500).json({ message: 'Error during update', error });
    }
});





router.put("/removeItemFromTeammate/:roomId/:itemId/:teammateId", async (req, res) => {
    try {

        const room = await Room.findOne({ _id: req.params.roomId });
        const teammate = await Teammate.findOne({ _id: req.params.teammateId });

        if (!room) {
            return res.status(401).json({ message: 'Room not found' });
        }

        if (!teammate) {
            return res.status(401).json({ message: 'Teammate not found' });
        }

        const index = await room.items.findIndex((item) => item.id === req.params.itemId);

        if (index < 0) {
            return res.status(401).json({ message: 'Item not found' });
        }

        const item = room.items[index];

        if (!item.teammates.includes(req.params.teammateId) || !teammate.items.includes(req.params.itemId)) {
            return res.status(401).json({ message: 'Item is not assigned to teammate' });
        }

        const index2 = await item.teammates.findIndex((teammate) => teammate._id === req.params.teammateId);

        const index3 = await teammate.items.findIndex((item) => item.id === req.params.itemId);

        await item.teammates.splice(index2, 1);

        await teammate.items.splice(index3, 1);

        await room.save();

        await teammate.save();

        res.status(200).json({ message: 'Item removed from teammate successfully', room: room });


    } catch (error) {
        res.status(500).json({ message: 'Error during update', error });
    }
});



router.put("/assignItemToArtisan/:roomId/:itemId/:artisanId", async (req, res) => {
    try {

        const room = await Room.findOne({ _id: req.params.roomId });
        const artisan = await Artisan.findOne({ _id: req.params.artisanId });

        if (!room) {
            return res.status(401).json({ message: 'Room not found' });
        }

        if (!artisan) {
            return res.status(401).json({ message: 'Artisan not found' });
        }

        const index = await room.items.findIndex((item) => item.id === req.params.itemId);

        if (index < 0) {
            return res.status(401).json({ message: 'Item not found' });
        }

        const item = room.items[index];

        console.log('item.artisan', item.artisan, 'req.params.artisanId', req.params.artisanId);

        //Tester si le poste de travail a déjà été attribué à l'artisant   /!\ le test est-il pertinant ?? /!\
        if (item.artisan === req.params.artisanId) {
            return res.status(401).json({ message: 'Item already assigned to artisan' });
        }

        item.artisan = req.params.artisanId;

        await room.save();

        res.status(200).json({ message: 'Item assigned to artisan successfully', room: room });

    } catch (error) {
        res.status(500).json({ message: 'Error during update', error });
    }
});



router.put("/setItemArtisan/:roomId/:itemId/:availability/:trustLevel/:quote/:comment", async (req, res) => {
    try {

        const room = await Room.findOne({ _id: req.params.roomId });
        const artisan = await Artisan.findOne({ _id: req.params.artisanId });

        if (!room) {
            return res.status(401).json({ message: 'Room not found' });
        }

        if (!artisan) {
            return res.status(401).json({ message: 'Artisan not found' });
        }

        const index = await room.items.findIndex((item) => item.id === req.params.itemId);

        if (index < 0) {
            return res.status(401).json({ message: 'Item not found' });
        }

        const item = room.items[index];

        console.log('item.artisan', item.artisan, 'req.params.artisanId', req.params.artisanId);

        //Tester si le poste de travail a déjà été attribué à l'artisant   /!\ le test est-il pertinant ?? /!\
        if (item.artisan === req.params.artisanId) {
            return res.status(401).json({ message: 'Item already assigned to artisan' });
        }

        item.artisan.artisanId = req.params.artisanId;

        await room.save();

        res.status(200).json({ message: 'Item assigned to artisan successfully', room: room });

    } catch (error) {
        res.status(500).json({ message: 'Error during update', error });
    }
});



router.put("/removeItemFromArtisan/:roomId/:itemId/", async (req, res) => {
    try {

        const room = await Room.findOne({ _id: req.params.roomId });

        if (!room) {
            return res.status(401).json({ message: 'Room not found' });
        }

        const index = await room.items.findIndex((item) => item.id === req.params.itemId);

        if (index < 0) {
            return res.status(401).json({ message: 'Item not found' });
        }

        const item = room.items[index];

        if (!item.artisan) {
            return res.status(401).json({ message: 'Item already not assigned to any artisan' });
        }

        item.artisan = null;

        await room.save();

        res.status(200).json({ message: 'Item removed from artisan successfully', room: room });


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

