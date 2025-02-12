/// Importar los módulos necesarios
const express = require('express');
const mysql = require('mysql2');
const authController = require('../controllers/authController');


const router = express.Router();

// Configuración de la conexión a MySQL
const connection = require("../db/db");

/* GET Home page */
router.get('/', (req, res, next) => {
    // Consulta a la base de datos
    connection.query('SELECT * FROM peliculas_recomendadas', (error, results, fields) => {
        if (error) {
            next(error); // Pasar el error al siguiente middleware de manejo de errores
            return;
        }
        // Renderizar la vista 'index' con los datos obtenidos
        res.render('index', { data: results });
    });
});


router.get('/registro', (req, res, next) => {
    res.render('registro');
});

router.post('/registro', authController.register);


router.post('/', authController.login);


module.exports = router;
