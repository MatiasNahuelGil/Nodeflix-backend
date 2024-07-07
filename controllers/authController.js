const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('../models/userModel');
const config = require('../config/config');
const { token } = require('morgan');




//Funcion de registro
function register(req,res)  {
     const {username,password} = req.body;
     
     console.log(`Registrando usuario: ${username}, contraseña: ${password}`);
     const hashedPassword = bcrypt.hashSync(password,8);

     const newUser = {id : users.length + 1, username, password: hashedPassword};

     users.push(newUser);

     const token = jwt.sign({id: newUser.id},config.secretKey, {expiresIn: config.tokenExpiresIn});

     res.status(200).json({ auth: true, token });
};

//funcion de inicio de sesion 

function login(req,res) {

    const {username, password} = req.body;

    const user = users.find( u=> u.username === username);

    if(!user) return res.status(404).send('User not found');

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if(!passwordIsValid) return res.status(401).send({auth: false, token: null});

    const token = jwt.sign({id: user.id}, config.secretKey, { expiresIn: config.tokenExpiresIn});

    res.status(200).json({ auth: true, token });
};


function storeUser (req,res){
    const data = req.body
    console.log(data)
    users.push(data);
    res.status(200).json({ message: 'User stored successfully' });
}

module.exports = {
    login,
    register,
    storeUser,
}
