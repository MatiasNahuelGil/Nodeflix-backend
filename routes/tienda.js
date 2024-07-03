// Importar los módulos necesarios
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import mysql from 'mysql2';

const router = express.Router();

// Configuración de multer para la carga de archivos
const upload = multer({ dest: 'uploads/' });

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Matias-619',
    database: 'nodeflix'
});

connection.connect();

/* Ruta para ver favoritos */
router.get('/', (req, res, next) => {
    // Seleccionamos todas las películas
    connection.query('SELECT * FROM peliculas', (error, results, fields) => {
        if (error) throw error;
        res.render('tienda', { data: results });
    });
});

/* Ruta para ver la película */
router.get('/viendoPelicula', (req, res, next) => {
    res.render('viendoPelicula');
});

/* Ruta para ver el formulario del alta */
router.get('/alta', (req, res, next) => {
    res.render('altaPelicula');
});

/* Método CREATE */
router.post('/alta', upload.single('imagen'), async (req, res, next) => {
    let sentencia = `INSERT INTO peliculas (genero_id, titulo, descripcion, imagen) VALUES (?, ?, ?, ?)`;
    let values = [req.body.genero_id, req.body.titulo, req.body.descripcion, `/images/${req.file.originalname}`];

    connection.query(sentencia, values, (error, results, fields) => {
        if (error) throw error;

        // Copiamos el archivo de upload a images
        fs.createReadStream(`./uploads/${req.file.filename}`).pipe(fs.createWriteStream(`./public/images/${req.file.originalname}`));

        // Renderizamos la vista cuando se carga exitosamente
        res.render('finalizado', { mensaje: 'Película agregada exitosamente' });
    });
});

/* Método UPDATE */
router.get('/modificar/:id', (req, res, next) => {
    connection.query('SELECT * FROM peliculas WHERE id = ?', [req.params.id], (error, results, fields) => {
        if (error) throw error;
        res.render('modificar', { data: results });
    });
});

router.post('/modificar/:id', upload.single('imagen'), async (req, res, next) => {
    let sentencia;
    let values;

    if (req.file) {
        sentencia = `UPDATE peliculas SET titulo = ?, descripcion = ?, imagen = ? WHERE id = ?`;
        values = [req.body.titulo, req.body.descripcion, `/images/${req.file.originalname}`, req.params.id];

        // Enviamos la foto a la carpeta uploads y luego lo redirigimos a la carpeta images
        fs.createReadStream(`./uploads/${req.file.filename}`).pipe(fs.createWriteStream(`./public/images/${req.file.originalname}`));
    } else {
        sentencia = `UPDATE peliculas SET titulo = ?, descripcion = ? WHERE id = ?`;
        values = [req.body.titulo, req.body.descripcion, req.params.id];
    }

    connection.query(sentencia, values, (error, results, fields) => {
        if (error) throw error;
        res.render('finalizado', { mensaje: 'La película fue modificada exitosamente' });
    });
});

/* Método DELETE */
router.get('/eliminar/:id', (req, res, next) => {
    connection.query('SELECT * FROM peliculas WHERE id = ?', [req.params.id], (error, results, fields) => {
        if (error) throw error;
        res.render('eliminar', { data: results });
    });
});

router.post('/eliminar/:id', (req, res, next) => {
    connection.query('DELETE FROM peliculas WHERE id = ?', [req.params.id], (error, results, fields) => {
        if (error) throw error;
        res.render('finalizado', { mensaje: 'La película fue eliminada exitosamente' });
    });
});

export default router;
