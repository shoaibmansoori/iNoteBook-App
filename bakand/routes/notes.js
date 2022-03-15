
const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');


// ROUT 1: Get all the notess using GET "/api/auth/getuser". login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status.error(500).send("Internal server Error");
    }
})
// ROUT 2: Add a new  Note using POST "/api/auth/addnote". login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description  must be atleast 5 character').isLength({ min: 5 }),
], async (req, res) => {

    try {

        const { title, description, tag } = req.body;
        // if  there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const notes = new Notes({
            title, description, tag, user: req.user.id
        })
        const saveNote = await notes.save()

        res.json(saveNote)
    } catch (error) {
        console.error(error.message);
        res.status.error(500).send("Internal server Error");
    }


})
// ROUT 3: Update a exsisting Note using PUT "/api/auth/updatenote". login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
    // create a newNote object 
    const newNote = {};
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };

    //Find the note  to  be update  it 
    let note = await Notes.findById(req.params.id);
    if (!note) { return res.status(404).send("Not Found") }

    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    res.json({ note });
    }catch (error) {
        console.error(error.message);
        res.status.error(500).send("Internal server Error");
    }
})

// ROUT 4: Delete  an exsisting Note using DELETE "/api/auth/deletenote". login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try{
    //Find the note  to  be delete it 
    let note = await Notes.findById(req.params.id);
    if (!note) { return res.status(404).send("Not Found") }
     
    //Allow deletion only ifb user owns this Note
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({ "Success":"Note has been deleted",note:note });
    }catch (error) {
        console.error(error.message);
        res.status.error(500).send("Internal server Error");
    }
})


module.exports = router