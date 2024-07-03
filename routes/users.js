// Importar los módulos necesarios
import express from 'express';

const router = express.Router();

/* GET users listing */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

export default router; // Exportar el router para que pueda ser importado