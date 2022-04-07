const { body, validationResult } = require('express-validator');
const pool = require('../database');
const { DateTime } = require('luxon');

// SDK de Mercado Pago
const mercadopago = require("mercadopago");
// Agrega credenciales
mercadopago.configure({
    access_token: "TEST-7232918609713626-122816-7c2626ce655448527d41d26d500bbd15-258090803",
});


exports.create_get = async (req, res, next)=>{
    const hours = await pool.query('SELECT * FROM hours');
    const services = await pool.query(`SELECT * FROM services WHERE subdivision = ?`, [req.params.service]);
    console.log(hours)
    res.render('date_form', {title: 'Reservar cita', services, hours});
}
exports.create_post = [
    
    body('date', 'Seleccione una fecha').optional({ checkFalsy: false }),
    body('hour', 'Seleccione un horario').optional({ checkFalsy: false }),
    body('paymentMethod', 'Seleccione un método de pago').optional({ checkFalsy: false }),
    body('service', 'Seleccione un servicio').optional({ checkFalsy: false }),

    async (req, res, next)=>{
        const serviceType = req.params.service;
        let { date, service, hour, paymentMethod } = req.body;
        const errors = validationResult(req);

        const newDate = {
            date,
            service,
            paymentMethod,
            user_id: req.user[0].id,
            hour
        }

        if (!errors.isEmpty()){
            const hours = await pool.query('SELECT * FROM hours');
            const serviceType = req.params.service;
            const services = await pool.query(`SELECT * FROM services WHERE subdivision = `);
            res.render('date_form', { title: 'Reservar cita', services, serviceType, hours, err: errors });
            return;
        }

        let dateExist;
        await pool.query(`SELECT * FROM dates WHERE date = '${newDate.date}'`)
        .then(res=>{
            dateExist = res[0];
            })
        .catch(err=>next(err));

        if (dateExist&&newDate.hour==dateExist.hour){
            const error = ['La fecha seleccionada está ocupada'];
            const hours = await pool.query('SELECT * FROM hours');
            const serviceType = req.params.service;
            const services = await pool.query(`SELECT * FROM services WHERE subdivision = ${serviceType}`);
            res.render('date_form', { title: 'Reservar cita', services, serviceType, hours, err:error });
            return;
        } else if (paymentMethod == 'virtual'){
            const selectedService = await pool.query(`SELECT price FROM services WHERE name = '${newDate.service}'`)
            let preference = {
                "items": [
                    {
                        title: newDate.service,
                        unit_price: selectedService[0].price,
                        quantity: 1,
                    }
                ],
                "back_urls": {
                    "success": "https://localhost:3000"
                }
            
            };

            mercadopago.preferences.create(preference)
                .then(function (response) {
                    res.redirect(response.body.sandbox_init_point)
                }).catch(function (error) {
                    console.log(error);
                });
        } else {
            await pool.query("INSERT INTO dates set ?", [newDate])
                .then()
                .catch(err => console.log(err));
            res.redirect('/dates');
        }
        
    }
]

exports.display_dates = async (req, res)=>{
    try {
    const dates = await pool.query('SELECT * FROM dates WHERE user_id = ?', [req.user[0].id]);
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

                delete newDate.hour;
                newDates.push(newDate);
            }
        };
        res.render('all_dates', { title: 'Salón de belleza', dates_list: newDates })

    } catch (error) {
        console.log(error, 'error en el try');
    }
}

exports.delete_get = async (req, res)=>{
    const id = req.params.id;
    const date = await pool.query(`SELECT * FROM dates WHERE id = ${id}`);
    if (date.length) {
            const newDate = date[0];
            const hour = newDate.hour;
            const formatedDate = DateTime.fromJSDate(newDate.date);

            newDate.date = DateTime.fromObject({
                month: formatedDate.c.month,
                day: formatedDate.c.day,
                hour
            }).toLocaleString(DateTime.DATETIME_MED);

            delete newDate.hour;     
        res.render('delete_date', { title: 'Cancelar cita', date: newDate });
        return;

    } else {res.status = 404}
}

exports.delete_post = async (req, res)=>{
    const id = req.params.id;
    await pool.query(`DELETE FROM dates WHERE id = ${id}`)
        .then(res.redirect('/dates'))
        .catch(err=>{
            if (err) res.render('error')
        })
}

exports.update_get = async (req, res)=>{
    const services = await pool.query('SELECT * FROM services');
    const id = req.params.id;
    const date = await pool.query(`SELECT * FROM dates WHERE id = ${id}`);
    const formatedDate = DateTime.fromJSDate(date[0].date).toFormat('yyyy-MM-dd');
    date[0].date = formatedDate;
    res.render('date_form', { title: 'Editar cita', past_date: date[0], services });
}

exports.update_post = [
    body('date', 'Seleccione una fecha').optional({ checkFalsy: false }),
    body('hour', 'Seleccione un horario').optional({ checkFalsy: false }),
    body('paymentMethod', 'Seleccione un método de pago').optional({ checkFalsy: false }),
    body('service', 'Seleccione un servicio').optional({ checkFalsy: false }),

    async (req, res, next) => {
        let { date, service, hour, paymentMethod } = req.body;
        const errors = validationResult(req);

        const newDate = {
            date,
            service,
            paymentMethod,
            user_id: req.user[0].id,
            hour
        }

        if (!errors.isEmpty()) {
            const services = await pool.query('SELECT * FROM services');
            res.render('date_form', { title: 'Reservar cita', err: errors.array(), past_date: newDate, services });
            return;
        }

        let dateExist;
        await pool.query(`SELECT * FROM dates WHERE date = '${newDate.date}'`)
            .then(res => {
                dateExist = res[0];
            })
            .catch(err => next(err));

        if (dateExist && newDate.hour == dateExist.hour) {
            const services = await pool.query('SELECT * FROM services');
            const error = ['La hora seleccionada ya está ocupada'];
            res.render('date_form', { title: 'Reservar una cita', err: error, past_date: newDate, services });
            return;
        } else if (paymentMethod == 'virtual') {
            const selectedService = await pool.query(`SELECT price FROM services WHERE name = '${newDate.service}'`)
            let preference = {
                "items": [
                    {
                        title: newDate.service,
                        unit_price: selectedService[0].price,
                        quantity: 1,
                    }
                ],
                "back_urls": {
                    "success": "https://localhost:3000"
                }

            };

            mercadopago.preferences.create(preference)
                .then(function (response) {
                    res.redirect(response.body.sandbox_init_point)
                }).catch(function (error) {
                    console.log(error);
                });
        } else {
            await pool.query('UPDATE dates set ? WHERE id = ?', [newDate, req.params.id])
                .then()
                .catch(err => console.error(err));
            res.redirect('/dates')
        }

    }

]
