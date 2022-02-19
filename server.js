const dotenv = require('dotenv');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
var path = require('path');

dotenv.config();
mongoose.connect(process.env.DATABASE_URI, {useNewUrlParser: true})
const db = mongoose.connection;

db.on('error', (error)=>console.error(error));
db.once('open', () => console.log('Connected to Database'));


//Serves static files located in webpack bundle
app.use(express.static(path.join(__dirname, 'dist')))
app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(cors({origin: 'http://localhost:3000'}));

const leaderboardRouter = require('./routes/leaderboard');
app.use('/leaderboard', leaderboardRouter);

app.listen(app.get('port'), ()=>{
    console.log('Dev server created');
});