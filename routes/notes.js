const express = require('express');
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');
const fetchuser = require('../middlewares/fetchuser');
const router = express.Router();



router.get('/fetch-notes', fetchuser, async (req, res) =>{
    try {
        const allNotes = await Note.find({user: req.user.id});

        res.json(allNotes);
    } catch (error) {
        console.log(error);
        res.json({error: "Internal Server Error"});
    }
});



router.post('/add-note', fetchuser, [
    body('title').isLength({min : 1})
], async (req, res)=>{
    try {
        const result  = validationResult(req);
        if(!result.isEmpty()){
            return res.json({errors: result});
        }
        const userId = req.user.id;
        const {title, content, tag} = req.body;
        
        const sendNote = await Note.create({
            title: title,
            content: content,
            tag: tag,
            user: userId
        });

        res.json(sendNote);
    } catch (error) {
        console.log(error);
        res.json({error: "Internal Server Error!! Contact Your It Team.!!!"});
    }
});

router.put('/update-note/:id', fetchuser, async (req, res)=>{
    try{
        const {title, content, tag} = req.body;
        let newNote = {};
        if(title)   {newNote.title = title};
        if(content) {newNote.content = content};
        if(tag)     {newNote.tag = tag};
        let note = await Note.findById(req.params.id);

        if(!note){
            return res.json({error: "Invalid Request"});
        }

        if(note.user.toString() !== req.user.id){
            return res.jsong({error: "Invalid Request"});
        }

        note = await Note.findByIdAndUpdate(req.params.id, newNote);
        note = await Note.findById(req.params.id);
        res.json({updated: note});

    }catch(err){
        console.log(err);
        res.send(err);
    }
});

router.delete('/delete-note/:id', fetchuser, async (req, res)=>{
    try{
        let note = await Note.findById(req.params.id);

        if(!note){
            return res.json({error: "Invalid Request"});
        }

        if(note.user.toString() !== req.user.id){
            return res.jsong({error: "Invalid Request"});
        }

        note = await Note.findByIdAndDelete(req.params.id);
        res.json({deleted: note});

    }catch(err){
        console.log(err);
        res.send(err);
    }
});

module.exports = router;