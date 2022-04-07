const bcrypt = require('bcryptjs');

const helpers = {};

helpers.encryptPassword = async password =>{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

helpers.matchPassword = async (password, savedPassword)=>{
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (error) {
        console.log(error);
    }
}

helpers.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else res.redirect('/auth/signin');}

module.exports = helpers;