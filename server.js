require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const SocketServer = require('./socketServer');

const corsOptions = {
  Credential: 'true',
};

const app = express();

app.use(express.json());
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
app.use(cookieParser());

const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', socket => {
    SocketServer(socket);
});

// Routes
app.use('/api', require('./routes/authRouter'));
app.use('/api', require('./routes/userRouter'));
app.use('/api', require('./routes/postRouter'));
app.use('/api', require('./routes/commentRouter'));
app.use('/api', require('./routes/adminRouter'));
app.use('/api', require('./routes/notifyRouter'));
app.use('/api', require('./routes/messageRouter'));

// DB Connection (✅ Fixed)
const URI = process.env.MONGO_URL;
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err) throw err;
    console.log("✅ Database Connected!");
});

const port = process.env.PORT || 5001;
http.listen(port, () => {
  console.log("🚀 Listening on port", port);
});
