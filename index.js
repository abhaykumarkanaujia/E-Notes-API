const connectToMongo = require('./db');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
connectToMongo();


const express = require('express')
const app = express()
app.use(cors());
const port = process.env.PORT;

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})