const passport = require('passport');
const { body, validationResult } = require('express-validator');

exports.signup_get = (req, res, next)=>{
    res.render('signup', {title: 'Registrarse'})
}
exports.signup_post = [
    body('email', 'Introduce un email válido').trim().isEmail().escape(),
    body('password', 'Introduce una contraseña de al menos 6 caracteres').trim().isLength({ min: 6 }).escape(),
    body('fullname', 'Introduce tu nombre completo').trim().isLength({ min: 1 }).escape(),

    (req, res, next)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const user = {
                email: req.body.email,
                fullname: req.body.fullname
            }
            res.render('signup', {title: 'Error', errors: errors.array(), past_user: user})
            return;
        } else next();
    },

        passport.authenticate('local.signup', {
        successRedirect: '/',
        failureRedirect: '/signup'
    })
]
exports.signin_get = (req, res)=>{
    res.render('signin', {title: 'Iniciar sesion'});
}
exports.signin_post = [

    passport.authenticate('local.signin', {
        successRedirect: '/',
        failureRedirect: '/auth/signin'
    })
]
exports.logOut = (req, res)=>{
    req.logOut();
    if (req.user){
        console.log(req.user)
    }
    res.redirect('/auth/signin');

}
