const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();
app.io = require('socket.io')();

const indexRouter = require('./routes/index')(app.io);
const userRouter = require('./routes/user');
const roomRouter = require('./routes/room');
const coupRouter = require('./routes/coup');

app.use(logger('dev'));
app.use(session({secret: "test", resave: true, saveUninitialized: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/dist'))); // Note

app.use('/', indexRouter);
app.use('/api/user', userRouter);
app.use('/api/room', roomRouter);
app.use('/api/coup', coupRouter);
app.use(function (req, res, next) {
  res.status(404).send("Sorry this url could not be found.")
})
module.exports = app;
