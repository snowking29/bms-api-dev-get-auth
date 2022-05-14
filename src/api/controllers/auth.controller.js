const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../helpers/validation');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

exports.postSignup = async (req, res) => {
    try {
        const { error } = registerValidation(req.query);
        if (error) return res.status(400).send({message:error.details[0].message})

        const { name, email, password } = req.query
        const key = uuid.v1()
        //Revisando si hay duplicidad
        const emailExist = await UserModel.findOne({"key":key})
        if (emailExist) return res.status(500).send({message:`Email already exist.`});
        

        //Encriptando passwords
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        //Creando nuevo usuario
        const newUser = new UserModel({
            key: key,
            name: name,
            email: email,
            password: hashPassword
        });
        await newUser.save(function(err,data){
            if (err) {
                console.log(err);
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
        if (error) return res.status(200).send({
            success: 'false',
            meta: {
                status: {
                    code: '01',
                    message_ilgn: [{
                        locale: 'es_PE',
                        value: error.details[0].message
                    }]
                }
            }});


        //Revisando si hay duplicidad
        const { email, password } = req.query
        const user = await UserModel.findOne({email});

        if (!user) return res.status(200).send({
            success: 'false',
            meta: {
                status: {
                    code: '01',
                    message_ilgn: [{
                        locale: 'es_PE',
                        value: 'El usuario no existe.'
                    }]
                }
            }
        });
        //PASSWORD IS CORRECT
        const validPass = await bcrypt.compare(password, user.password);
        
        if (!validPass) return res.status(200).send({
            success: 'false',
            meta: {
                status: {
                    code: '01',
                    message_ilgn: [{
                        locale: 'es_PE',
                        value: 'Contraseña incorrecta.'
                    }]
                }
            }
        })

        const token = jwt.sign({_id: user._id}, process.env.ACCESS_KEY)
        res.status(200).send({
            success: 'true',
            data: {
                token: token,
                name: user.name,
                email: user.email,
                role: user.role
            },
            meta: {
                status: {
                    code: '00',
                    message_ilgn: [{
                        locale: 'es_PE',
                        value: 'El usuario ingreso correctamente.'
                    }]
                }
            }
        });
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