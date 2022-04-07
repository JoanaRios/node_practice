const pool = require('../database');
const { DateTime } = require('luxon');


exports.adminKey = (req, res, next)=>{
    if (req.params.key == '191001'){
        next()
    }else{
        res.status = 500;
    }
}
exports.index = async (req, res)=>{
    try {
        const dates = await pool.query('SELECT * FROM dates');
        const newDates = [];

        if (dates.length) {
            for (let i = 0; i < dates.length; i++) {
                const newDate = dates[i];
                const hour = newDate.hour;
                const formatedDate = DateTime.fromJSDate(newDate.date);

                newDate.date = DateTime.fromObject({
                    month: formatedDate.c.month,
                    day: formatedDate.c.day,
                    hour: hour
                }).toLocaleString(DateTime.DATETIME_MED);

                const user = await pool.query(`SELECT * FROM users WHERE id = ${newDate.user_id}`)
                newDate.user = user[0];
                delete newDate.hour;

                newDates.push(newDate);
            }
        };
        res.render('admin', { title: 'Administración', dates_list: newDates })

    } catch (error) {
        console.log(error, 'error en el try');
    }
}
exports.userDetail = async (req, res)=>{
    const user = await pool.query(`SELECT * FROM users WHERE id = ${req.params.id}`);
    res.render('user_detail', {title: 'Info usuario', user: user[0]})
}