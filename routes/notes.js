const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const success = false;

//get all the notes by - api/notes/fetchallnotes
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send({error:"Internal error occured"});
    }
});

//add the new notes : /api/notes/addnotes :> login required 
router.post('/addnotes', fetchuser, [
    body('title', "Enter a valid title").isLength({ min: 3 }),
    body('description', "Description must be at least 5 character").isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        //if their is error in validations 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Notes({
            title, description, tag, user: req.user.id
        });
        const savenote = await note.save();
        res.json(savenote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({error:"Internal error occured"});
    }

});

//update the existing notes : /api/notes/updatenote n  :> login require
router.put('/updatenotes/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    //create a newNote object
    try {
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //find the note to be update and update it
        const note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send({error:"Not Found"}); }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send({error:"Not Allowed"});
        }

        const noted = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ noted });

    } catch (error) {
        console.error(error.message);
        res.status(500).send({error:"Internal error occured"});
    }
});
//update/delete the existing notes : /api/notes/deletenotes n  :> login require
router.delete('/deletenotes/:id', fetchuser, async (req, res) => {

    try {
        //find the note to be update/delete and update/delete it
        const note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send({error:"Not Found"}); }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send({error:"Not Allowed"});
        }

        const noted = await Notes.findByIdAndDelete(req.params.id);
        res.json({"Success": "Notes has been deleted", notes: noted });

    } catch (error) {
        console.error(error.message);
        res.status(500).send({error:"Internal error occured"});
    }
});

module.exports = router