// Importar los módulos necesarios
const express = require('express');
const mysql = require('mysql2'); // Usamos mysql2 para manejar conexiones

const router = express.Router();

// Configuración de la conexión a MySQL usando callbacks
const connection = require("../db/db");

/* GET busqueda page */
router.get('/', (req, res, next) => {
    // Consulta a la base de datos
    connection.query('SELECT * FROM peliculas', (error, resultsMovies, fields) => {
        if (error) {
            console.error('Error querying MySQL:', error.message);
            return next(error); // Pasar el error al siguiente middleware de manejo de errores
        }

        // Renderizar la vista 'busqueda' con los datos obtenidos
        res.render('busqueda', { data: resultsMovies });
    });
});

module.exports = router; // Exportar el router para que pueda ser importado
