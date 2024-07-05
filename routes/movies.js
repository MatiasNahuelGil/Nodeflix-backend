// Importar los módulos necesarios
const express = require('express');
const mysql = require('mysql2');

const router = express.Router();

// Configuración de la conexión a MySQL
const connection = require("../db/db");

/* GET movies page */
router.get('/', (req, res, next) => {
    // Consulta a la base de datos
    connection.query('SELECT * FROM peliculas', (error, results, fields) => {
        if (error) {
            next(error); // Pasar el error al siguiente middleware de manejo de errores
            return;
        }
        // Renderizar la vista 'movies' con los datos obtenidos
        res.render('movies', { data: results });
    });
});

module.exports = router; // Exportar el router para que pueda ser importado
