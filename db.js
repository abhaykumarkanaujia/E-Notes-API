const mongoose = require('mongoose');
const mongodbURI = "mongodb://0.0.0.0:27017/e-notes";

const connectToMongo = () =>{
    mongoose.connect(mongodbURI);
}


module.exports = connectToMongo;