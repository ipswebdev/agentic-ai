require("dotenv").config();

const express = require('express');
const cors = require('cors');
// const { sendMessage } = require('./controllers/chat.controller');
const {chatRouter} = require('./routes/chat.routes');
const { documentRouter } = require('./routes/documents.routes');
const { connectDb } = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json())

connectDb()
.then(()=>{
  console.log('connection to MongoDB Success')
  app.listen(3001, () => {
    console.log('Backend running on port 3001');
  });
}).catch((err)=>{
  console.error(err);
})

app.use('/chat',chatRouter);
app.use('/documents',documentRouter);



app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'backend'
  });
});



