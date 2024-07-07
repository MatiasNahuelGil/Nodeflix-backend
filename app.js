const createError = require('http-errors');
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');
const bodyParser = require('body-parser');


//RUTAS
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const contactRouter = require('./routes/contact');
const storeRouter = require('./routes/tienda');
const registerRouter = require('./routes/register');
const searchRouter = require('./routes/search');



//CONECCIÓN A BASE DE DATOS
const connection = require("./db/db");

const app = express();

// VIEW ENGINE SETUP
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

/* Rutas para las vistas */
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/movies', moviesRouter);
app.use('/contact', contactRouter);
app.use('/tienda', storeRouter);
app.use('/registro', registerRouter);
app.use('/busqueda', searchRouter);


app.post('/busqueda', (req, res) => {
  const searchTerm = req.body.search; // Obtener el término de búsqueda desde el formulario
  const query = `SELECT * FROM peliculas WHERE titulo LIKE '%${searchTerm}%'`;

  connection.query(query, (error, results) => {
    if (error) throw error;

    if (results.length === 0 || !searchTerm) {
      res.render('sinResultados', { searchTerm });
    } else {
      res.render('busqueda', { data: results }); // Renderizar la vista de resultados de búsqueda
    }
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// ERROR HANDLER
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // RENDERIZAR EL ERROR DE LA PAGINA
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
