require("dotenv").config();

const express = require('express');
const cors = require('cors');
const { logger } = require('./config/logger');
const {chatRouter} = require('./routes/chat.routes');
const {authRouter} = require('./routes/auth.routes');

const { documentRouter } = require('./routes/documents.routes');
const { connectDb } = require('./config/database');
const {
    FRONTEND_ENDPOINT,
    PORT
} = require("./config/env");
const { success } = require("./utils/response.utils");

const app = express();

const frontendEndpoint = FRONTEND_ENDPOINT;

const corsOptions = {
    origin: frontendEndpoint,
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json())

connectDb()
.then(()=>{
  logger.info('connection to MongoDB Success')
  app.listen(PORT, () => {
    logger.info(`Backend running on port ${PORT}`);
  });
}).catch((err)=>{
  logger.error(err);
})

app.use('/chat',chatRouter);
app.use('/documents',documentRouter);
app.use('/auth',authRouter);


app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'backend',
    success:true
  });
});



