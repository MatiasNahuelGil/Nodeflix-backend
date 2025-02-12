import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

// AM 20240628
//import {usuarios} from "./../controllers/authentication.controller.js";
import {db}  from "../db/db.js";

dotenv.config();

function soloAdmin(req,res,next){
  const logueado = revisarCookie(req);
  if(logueado) return next();
  return res.redirect("/")
}

function soloPublico(req,res,next){
  const logueado = revisarCookie(req);
  if(!logueado) return next();
  return res.redirect("/admin")
}

function revisarCookie(req){
  try{
    const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
    const decodificada = jsonwebtoken.verify(cookieJWT,process.env.JWT_SECRET);
    console.log(decodificada)
    // AM 20240628
    //const usuarioAResvisar = usuarios.find(usuario => usuario.user === decodificada.user);
    const sql = 'SELECT * FROM usuario WHERE user = ?';
    let [usuarioAResvisar, fields] =  db.query(sql, [decodificada.user]); 

    console.log(usuarioAResvisar)
    if(!usuarioAResvisar){
      return false
    }
    return true;
  }
  catch{
    return false;
  }
}


export const methods = {
  soloAdmin,
  soloPublico,
}