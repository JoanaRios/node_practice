const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');
const sqlsesion = require('express-mysql-session');
const passport = require('passport');

const { database } = require('./keys');

//initializations
const app = express();
require('./passportConfig')


//middlewares
app.use(session({
    secret: 'salon_app',
    resave: true,
    saveUninitialized: true,
    store: sqlsesion(database)
}));
app.use(express.json());
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//global variables
app.use((req, res, next)=>{
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.error = req.flash('error');
    if (req.user){
        app.locals.user = req.user[0];
    }
    next();
})
//settings
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('env', 'development')

//statics
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use(('/'), require('./routes/index'));
app.use('/auth', require('./routes/authentication'));
app.use('/dates', require('./routes/dates'));
app.use('/admin', require('./routes/admin'));

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    // res.render('error');
    res.send(err.message)
});

// starting server
app.listen(app.get('port'), ()=>{
    console.log('Server on port', app.get('port'));
})
