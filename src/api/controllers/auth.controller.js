const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../helpers/validation');
const bcrypt = require('bcryptjs')

exports.postSignup = (req, res) => {
    try {
        const { error } = registerValidation(req.query);
        if (error) return res.status(400).send({message:error.details[0].message})

        const { email, password } = req.query
        //Revisando si hay duplicidad
        const emailExist = UserModel.findOne({email});
        if (emailExist) return res.status(500).send({message:`Email already exist.`});

        //Encriptando passwords
        const salt = bcrypt.genSalt(10);
        const hashPassword = bcrypt.hash(password, salt);

        //Creando nuevo usuario
        const newUser = new UserModel({
            name: req.body.name,
            email: email,
            password: hashPassword
        });
        newUser.save(function(err,data){
            if (err) {
                console.log(error);
            }
        });

        const token = jwt.sign({_id: newUser._id}, process.env.ACCESS_KEY)
        res.status(200).json({id: newUser._id, token, message:"Successfully registered"})
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

exports.postLogin = async (req, res) => {
    try {
        const { error } = loginValidation(req.query);
        if (error) return res.status(400).send({message:error.details[0].message});

        //Revisando si hay duplicidad
        const { email, password } = req.query
        const user = await UserModel.findOne({email});
        if (!user) return res.status(200).send({message:`El usuario no existe.`});
        //PASSWORD IS CORRECT
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(200).send({message:'Contraseña incorrecta.'})
        
        const token = jwt.sign({_id: user._id}, process.env.ACCESS_KEY)
        const name = user.name;
        res.status(200).send({token,name,message:'LoggedIn'});
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

exports.deleteLogout = (req, res) => {
    try {
        const refreshToken = req.header("x-auth-token");
  
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
        res.sendStatus(204);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}