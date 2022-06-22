const express = require('express');
const router = express.Router();
const Score = require('../models/score');

//Get past leaderboard scores
router.get('/', async (req, res)=>{
    try{
        const scores = await Score.find();
        res.json(scores);
    }catch(e){
        res.status(500)
        res.json({message: e.message});
    }
})

//Add new score
router.post('/', async (req, res)=>{
    const score = new Score({
        score: req.body.score,
        date: req.body.date,
        name: req.body.name
    });
    try{
        const newScore = await score.save();
        res.status(201);
        res.json(newScore);
        console.log('successful post');
    }catch(e){
        res.send(e.error);
    }
})

module.exports = router;