const userModel = require ('./users_model');
const socialLogins = require('../social_logins/social_logins_model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const db = require('../../config/db_config');

class Sellers {
  
    constructor() { }

    verifyIdentity() {
        return async (req, res) => {
            try {
                let { id, role, u_id } = req.body;
                
                if (!id ||!role ||!u_id) {
                    return res.status(400).send({ status: false, message: `Bad Request` });
                }

                let checkAlphabet = /^[A-Z]/;
                let checkDigit = /^\d+$/;
                
                if (u_id.length < 9 || u_id.length > 9 || !(u_id.charAt(0) === 'U') || (!checkAlphabet.test(u_id.charAt(8))) || !checkDigit.test(u_id.substr(1,7))) {
                    return res.status(400).send({ status: false, message: `Bad Request. Invalid Student/Faculty ID` });
                }

                let result = await userModel.findOne({ where: { id, status: 0 } });
                if (!result) {
                    return res.status(404).send({ status: false, message: `Bad Request. User not found` });
                }
                let update = await result.update({ status: 1, u_id, role });
                return jwt.sign({ id: update.id, status: update.status, role: update.role, firstName: update.first_name, lastName: update.last_name, email: update.email }, config.privateKey, { expiresIn: '7 days' }, function(err, token) {
                    if (err) {
                        console.log('Error in generating jwt token. ', err);
                        res.status(500);
                        return res.json({ msg: 'Internal Server Error', error: err });
                    } else {
                        return res.send({ 
                            status: true, 
                            message: 'Identity verification successful', 
                            token, 
                            user: { 
                                id: update.id,
                                firstName: update.first_name, 
                                lastName: update.last_name, 
                                email: update.email, 
                                status: update.status,
                                role: update.role 
                            }
                        });
                    }
                });
            } catch (err) {
                console.log('Error', err);
                return res.status(500).send({ status: false, message: `Sorry , couldn't verify Identity`, err });
            }
        }
    }

    userRegister() {
        return async (req, res) => {
            let { firstName, lastName, email, password, u_id } = req.body;

            if (!firstName ||!lastName ||!email ||!password) {
                return res.status(400).send({ msg: 'Bad Request' });
            }
            
            try {
                const userExists = await userModel.findOne({ where: { email: email.toLowerCase() } });
                if (userExists) {
                    return res.status(401).send({ msg: 'User against this email already exist' });
                } else {
                    let generateHash = function (password) {
                        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
                    };
                    
                    let hashPassword = generateHash(password);
                    let obj = {
                        first_name: firstName,
                        last_name: lastName,
                        email: email.toLowerCase(),
                        password: hashPassword
                    };
                    if (u_id) {
                        obj.u_id = u_id,
                        obj.role = 'faculty',
                        obj.status = true
                    }
                    const user = await userModel.create(obj);
                    return res.status(200).send({ status: true, msg: 'User Registered Successfully' });
                }
            } catch (error) {
                console.log('Error in user registeration', error);
                return res.status(500).send({ msg: 'Internal Server Error', error });
            }
        }
    }

    adminRegister() {
        return async (req, res) => {
            let { firstName, lastName, email, password } = req.body;

            if (!firstName ||!lastName ||!email ||!password) {
                return res.status(400).send({ msg: 'Bad Request' });
            }
            
            try {
                const userExists = await userModel.findOne({ where: { email: email.toLowerCase() } });
                if (userExists) {
                    return res.status(401).send({ msg: 'User against this email already exist' });
                } else {
                    let generateHash = function (password) {
                        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
                    };
                    
                    let hashPassword = generateHash(password);
             
                    const user = await userModel.create({
                        first_name: firstName,
                        last_name: lastName,
                        email: email.toLowerCase(),
                        password: hashPassword,
                        role: 'admin',
                        status: true
                    });
                    return res.status(200).send({ status: true, msg: 'Admin Registered Successfully' });
                }
            } catch (error) {
                console.log('Error in admin registeration', error);
                return res.status(500).send({ msg: 'Internal Server Error', error });
            }
        }
    }

    listUsers() {
        return async (req, res) => { 
            
            let { user } = req.params;

            if (!user) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

            try {
                const result = await userModel.findAndCountAll({ where: { role: user } });
                const { count, rows } = result;
                return res.status(200).send({ count, data: rows });
            } catch (err) {
                console.log('Error in listing user from db', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }   
        }
    }
    
    userLogin() {
        return async (req, res) => {
            let { email, password } = req.body;

            if (!email ||!password) {
                return res.status(400).send({ msg: 'Bad Request' });
            }
            
            try {
                const userExists = await userModel.findOne({ where: { email: email.toLowerCase() } });
                if (userExists) {
                    let validPasscode = await bcrypt.compareSync(password, userExists.password);
                    if (validPasscode) {
                        return jwt.sign({ id: userExists.id, status: userExists.status, role: userExists.role, firstName: userExists.first_name, lastName: userExists.last_name, email: userExists.email }, config.privateKey, { expiresIn: '30 days' }, function(err, token) {
                            if (err) {
                                console.log('Error in generating jwt token. ', err);
                                res.status(500);
                                return res.json({ msg: 'Internal Server Error', error: err });
                            } else {
                                res.status(200);
                                return res.send({ 
                                    token: token,
                                    user: { 
                                        id: userExists.id,
                                        firstName: userExists.first_name, 
                                        lastName: userExists.last_name, 
                                        email: userExists.email, 
                                        status: userExists.status,
                                        role: userExists.role 
                                    }
                                });
                            }
                        });
                    } else {
                        res.status(401);
                        return res.send({ msg: 'Invalid Email or Password' });
                    }
                } else {
                    res.status(404);
                    return res.send({ msg: 'No user registered against this email' });
                }
            } catch (error) {
                console.log('Error in user login', error);
                return res.status(500).send({ msg: 'Internal Server Error', error });
            }
        }
    }

    fbAuth() {
        return async (req, res) => {
            const {
                account: {
                    accessToken,
                    profile: { id, emails, photos,
                        name: { givenName, familyName }
                    }
                }
            } = req;
            let { role } = req.body;  
            let email, profilePicture;
            
            if (photos.length !== 0){
                profilePicture = photos[0].value;
            }

            if (emails.length !== 0){
                email = emails[0].value;
            }

            let transaction;
            try {
                const userExists = await socialLogins.findOne(
                    {
                        where: { fb_id: id },
                        include: [{
                            model: userModel,
                            where: {
                                email
                            }
                        }]
                    });
                if (userExists) {
                    return jwt.sign({ id: userExists.user.id, status: userExists.user.status, role: userExists.user.role, firstName: userExists.user.first_name, lastName: userExists.user.last_name, email: userExists.user.email }, config.privateKey, { expiresIn: '7 days' }, function(err, token) {
                        if (err) {
                            console.log('Error in generating jwt token. ', err);
                            res.status(500);
                            return res.json({ msg: 'Internal Server Error', error: err });
                        } else {
                            return res.send({ 
                                status: true, 
                                message: 'Singin successful', 
                                token, 
                                user: { 
                                    id: userExists.user.id,
                                    firstName: userExists.user.first_name, 
                                    lastName: userExists.user.last_name, 
                                    email: userExists.user.email, 
                                    status: userExists.user.status,
                                    role: userExists.user.role,
                                    profilePicture: profilePicture 
                                }
                            });
                        }
                    })
                } 

                transaction = await db.sequelize.transaction();
                const user = await userModel.create({
                    first_name: givenName,
                    last_name: familyName,
                    email,
                    role
                }, {transaction});
                const fb = await socialLogins.create({
                    token: accessToken,
                    tokenType: 'access',
                    fb_id: id,
                    user_id: user.id
                }, { transaction });
                await transaction.commit();
                return jwt.sign({ id: user.id, status: user.status, role: user.role, firstName: user.first_name, lastName: user.last_name, email: user.email }, config.privateKey, { expiresIn: '7 days' }, function(err, token) {
                    if (err) {
                        console.log('Error in generating jwt token. ', err);
                        res.status(500);
                        return res.json({ msg: 'Internal Server Error', error: err });
                    } else {
                        return res.send({ 
                            status: true, 
                            message: 'Singin successful', 
                            token, 
                            user: { 
                                id: user.id,
                                firstName: user.first_name, 
                                lastName: user.last_name, 
                                email: user.email, 
                                status: user.status,
                                role: user.role,
                                profilePicture: profilePicture 
                            }
                        });
                    }
                })
            } catch (err) {
                if (transaction) await transaction.rollback();
                console.log('Error', err);
                res.status(500);
                return res.send({ status: false, message: `Sorry , couldn't create user`, err });
            }
        }
    }
}

module.exports = new Sellers();
