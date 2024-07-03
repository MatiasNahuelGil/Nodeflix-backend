import createError from 'http-errors';
import express from 'express';
import mysql from 'mysql2';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import hbs from 'hbs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import {methods as authentication} from "./controllers/authentication.controller.js"
import {methods as authorization} from "./middlewares/authorization.js";

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Matias-619',
  database: 'nodeflix'
});

connection.connect();

/*ROUTES*/ 
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import moviesRouter from './routes/movies.js';
import contactRouter from './routes/contact.js';
import storeRouter from './routes/tienda.js';
import registerRouter from './routes/register.js';
import searchRouter from './routes/search.js'


const app = express();

// VIEW ENGINE SETUP
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

/*Rutas para las vistas */
app.use('/', authorization.soloPublico,indexRouter);
app.use('/users', authorization.soloPublico,usersRouter);
app.use('/movies', authorization.soloPublico,moviesRouter);
app.use('/contact', authorization.soloPublico,contactRouter);
app.use('/tienda', authorization.soloPublico,storeRouter);
app.use('/registro', authorization.soloPublico,registerRouter);
app.use('/busqueda',authorization.soloPublico,searchRouter)




app.post("/api/login", authentication.login);
app.post("/api/register", authentication.register);
app.post('/busqueda', (req, res) => {
  const searchTerm = req.body.search; // Obtener el término de búsqueda desde el formulario
  const query = `SELECT * FROM peliculas WHERE titulo LIKE '%${searchTerm}%'`;

  connection.query(query, (error, results) => {
    if (error) throw error;

    if(results.length === 0 || !searchTerm){
      res.render('sinResultados', {searchTerm});
    }else{
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

export default app;
