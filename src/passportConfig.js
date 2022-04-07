const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const pool = require('./database');
const helper = require('./helpers');

passport.use('local.signin', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done)=>{
    const rows = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0){ // si se encuentra el email
        const user = rows[0];
        // validamos contraseña
        const validPassword = await helper.matchPassword(password, user.password);
        if (validPassword){
            done(null, user, req.flash('success', `Hola de nuevo ${user.fullname}`));
        } else {
            done(null, false, req.flash('error', 'Contraseña incorrecta'));
        }
    } else { //no se encontro email
        if (!rows.length > 0){
            req.flash('error', 'Email incorrecto') 
            done(null, false)
        }
        //done(null, false)
    }
}))

passport.use('local.signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
    }, async (req, email, password, done)=>{
        const { fullname } = req.body;
        const newUser = {
            email,
            password,
            fullname
        };
        newUser.password = await helper.encryptPassword(password);
        await pool.query('INSERT INTO users SET ?', [newUser])
        .then(res=>{
            newUser.id = res.insertId;
            req.flash('success', `Bienvenido ${newUser.fullname}!`)
            return done(null, newUser);
        })
        .catch(err=>console.log(err));
}));

passport.serializeUser((user, done)=>{
    done(null, user.id);
})

passport.deserializeUser(async (id, done)=>{
    await pool.query(`SELECT * FROM users WHERE id = ${id}`)
    .then(res=>{
        return done(null, res)})
    .catch(err=>console.log(err));
})
