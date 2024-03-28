const mongoose = require('mongoose');
require('dotenv').config();
const mongodbURI = process.env.URI;
const connectToMongo = () =>{
    mongoose.connect(mongodbURI);
}


module.exports = connectToMongo;