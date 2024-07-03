import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// AM 20240628
import {db}  from "../db/db.js";
/*export const usuarios = [{
  user: "a",
  email: "a@a.com",
  password: "$2a$05$nLY2It8riku2vwwDIINdgO/XIyPXRg1Gn9LFgnhwKqC4TwcAwEUL2"
}]*/


async function login(req,res){
  console.log(req.body);
  const user = req.body.user;
  const password = req.body.password;
  if(!user || !password){
    return res.status(400).send({status:"Error",message:"Los campos están incompletos"})
  }
  // AM 20240628
  //const usuarioAResvisar = usuarios.find(usuario => usuario.user === user);
  const sql = 'SELECT * FROM usuario WHERE user = ?';
  let [usuarioAResvisar, fields] = await db.promise().query(sql, [user]); 
  
//  if(!usuarioAResvisar){
  if (usuarioAResvisar.length == 0) {
    return res.status(400).send({status:"Error",message:"Error durante login - usuario inexistente"})
  }

  const loginCorrecto = await bcryptjs.compare(password,usuarioAResvisar[0].password);
  if(!loginCorrecto){
    return res.status(400).send({status:"Error",message:"Error durante login"})
  }
  const token = jsonwebtoken.sign(
    {user:usuarioAResvisar[0].user},
    process.env.JWT_SECRET,
    {expiresIn:process.env.JWT_EXPIRATION});

    const cookieOption = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      path: "/"
    }
    res.cookie("jwt",token,cookieOption);
    res.send({status:"ok",message:"Usuario loggeado",redirect:"/admin"}); // AM redireccionar al index...
}

async function register(req,res){
  const user = req.body.user;
  const password = req.body.password;
  const email = req.body.email;
  if(!user || !password || !email){
    return res.status(400).send({status:"Error",message:"Los campos están incompletos"})
  }
  // AM 20240628
  //const usuarioAResvisar = usuarios.find(usuario => usuario.user === user);
  const sql2 = 'SELECT * FROM usuario WHERE user = ?';
  let [usuarioAResvisar, fields] = await db.promise().query(sql2, [user]); 

  //if(usuarioAResvisar){
  if (usuarioAResvisar.length > 0) {
    return res.status(400).send({status:"Error",message:"Este usuario ya existe"})
  }


  const salt = await bcryptjs.genSalt(5);
  const hashPassword = await bcryptjs.hash(password,salt);
  const nuevoUsuario ={
    user, email, password: hashPassword
  }
  // AM 20240628
  //usuarios.push(nuevoUsuario);
  //console.log(usuarios);
  //return res.status(201).send({status:"ok",message:`Usuario ${nuevoUsuario.user} agregado`,redirect:"/"})
  const sql = 'INSERT INTO usuario (user, email, password) VALUES (?, ?, ?)';
  db.query(sql, [nuevoUsuario.user, nuevoUsuario.email, nuevoUsuario.password], (err, result) => {
    if (err) throw err;

  // AM 20240701: loguear al usuario que se acaba de registrar
  const token = jsonwebtoken.sign(
    {user:nuevoUsuario.user},
    process.env.JWT_SECRET,
    {expiresIn:process.env.JWT_EXPIRATION});

    const cookieOption = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      path: "/"
    }
    res.cookie("jwt",token,cookieOption);
    //res.send({status:"ok",message:"Usuario loggeado",redirect:"/admin"}); // AM redireccionar al index...

    return res.status(201).send({status:"ok",message:`Usuario ${nuevoUsuario.user} agregado`,redirect:"/"})
  });
}

export const methods = {
  login,
  register
}