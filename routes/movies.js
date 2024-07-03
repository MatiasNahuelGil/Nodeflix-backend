// Importar los módulos necesarios
import express from 'express';
import mysql from 'mysql2/promise'; // Usamos mysql2/promise para manejar conexiones promisificadas


const router = express.Router();

// Configuración de la conexión a MySQL
const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Matias-619',
    database: 'nodeflix'
});


/* GET movies page */
router.get('/', async (req, res, next) => {
    try {
        // Consulta a la base de datos
        const [resultsMovies, fields] = await connection.execute('SELECT * FROM peliculas');

        // Renderizar la vista 'movies' con los datos obtenidos
        res.render('movies', { data: resultsMovies });
    } catch (error) {
        next(error); // Pasar el error al siguiente middleware de manejo de errores
    }
});

export default router; // Exportar el router para que pueda ser importado