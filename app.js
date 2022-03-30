const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
const db = require('./db');

// get routers
const {
  dashboardRouter,
  categoryRouter,
  nominalRouter,
  voucherRouter,
  bankRouter,
  paymentRouter,
  userRouter,
  transactionRouter,
  playerRouter,
  authRouter,
} = require('./app/router');

// init express app
const app = express();
const URL = '/api/v1';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// handle db
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('connection is opened');
});

// use middlewares
app.use(cors());
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {},
  })
);
app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(
  '/adminlte',
  express.static(path.join(__dirname, 'node_modules/admin-lte/'))
);

// use routers
app.use('/', userRouter);
app.use('/dashboard', dashboardRouter);
app.use('/category', categoryRouter);
app.use('/nominal', nominalRouter);
app.use('/voucher', voucherRouter);
app.use('/bank', bankRouter);
app.use('/payment', paymentRouter);
app.use('/transaction', transactionRouter);

// API
app.use(`${URL}/players`, playerRouter);
app.use(`${URL}/auth`, authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
