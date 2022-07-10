const connectToDatabase = require('./api/database/db')
const serverless = require('serverless-http');
const express = require('express');
const app = express();
const UserModel = require('./api/models/user');
const jwt = require('jsonwebtoken');
const { loginValidation } = require('./api/helpers/validation');
const bcrypt = require('bcryptjs');
var cors = require('cors')

app.use(cors());
app.post('/login', async (req, res) => {
    console.log("entre")
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

        
        //Estableciendo conexion con db
        await connectToDatabase();
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
        res.setHeader('Access-Control-Allow-Origin', ['*']);
        res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
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
})
module.exports.handler = serverless(app);


