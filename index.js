const connectToMongo = require('./db');
const cors = require('cors');
connectToMongo();

const express = require('express')
const app = express()
app.use(cors());
const port = 3001

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})