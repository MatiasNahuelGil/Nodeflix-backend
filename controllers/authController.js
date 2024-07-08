const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const connection = require('../db/db'); // Asumiendo que este archivo exporta la conexión a la base de datos
const { promisify } = require('util');
require('dotenv').config();

const query = promisify(connection.query).bind(connection);

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);
        
        const sql = 'INSERT INTO usuario SET ?';
        await query(sql, { user: username, password: hashedPassword });

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Por favor ingrese usuario y contraseña' });
        }

        const sql = 'SELECT * FROM usuario WHERE user = ?';
        const results = await query(sql, [username]);

        if (results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrecta' });
        }

        const userId = results[0].id;
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRETO, {
            expiresIn: process.env.JWT_TIEMPO_EXPIRA
        });

        const cookieOptions = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        res.cookie('jwt', token, cookieOptions);
        res.status(200).render('index',{ message: `${username}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};


exports.isAuthenticated = async (req,res,next) => {
    if(req.cookieOptions.jwt){
        try{
            const decodificada = await promisify(jwt.verify)(req.cookieOptions.jwt, process.env.JWT_SECRETO)
            connection.query('SELECT * FROM usuario WHERE ID = ?', [decodificada.id], (error,results) =>{
                if(!results){
                    return next()
                }
                req.user = results[0]
                return next()
            })
        }catch(error){
             console.log(error)
             return next()
        }
       }else{
           res.redirect('/')
           next
        }
    }
