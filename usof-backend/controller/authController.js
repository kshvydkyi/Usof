'use strict'

const jwt = require('jsonwebtoken');
const config = require('../config');
const response = require('./../response');
const User = require('./../models/user');
const bcrypt = require('bcryptjs');
const checkPass = require('check-password-strength');
const EmailValidator = require('email-deep-validator');
const sendEmail = require('./../middleware/sendMail');


exports.registration = async (req, res) =>{
    const {
        login, password, passwordConfirmation, fullName, email
    } = req.body;
    if(!login || !password || !passwordConfirmation || !fullName || !email) {
        return response.status(400, {message: `Fill in all fields`}, res);
    }
    if(password !== passwordConfirmation) {
        return response.status(400, {message: `Passwords do not match`}, res);
    }
    else if(await User.isLoginExist(login)){
        return response.status(409, {message:`User with login - ${login} already exist`}, res);

    }
    else if(await User.isEmailExist(email)){
        return response.status(409, {message:`User with email - ${email} already exist`}, res);
    }

    else if(login.indexOf(' ') >= 0){
        return response.status(400, {message: 'The login cannot have spaces'}, res);
    }
    else if(checkPass.passwordStrength(password).value === 'Too weak' || checkPass.passwordStrength(password).value === 'Weak'){
        return response.status(400, {message: 'The password is too easy'}, res);
     }
    const emailValidator = new EmailValidator();
    const { wellFormed, validDomain, validMailbox } = await emailValidator.verify(email);
    if(wellFormed && validMailbox && validDomain){
        const salt = bcrypt.genSaltSync(15);
        const encryptedPass = bcrypt.hashSync(password, salt)
        try {
            const token = jwt.sign({
                login, password: encryptedPass, fullName, email
            }, config.jwt, {expiresIn: '15m'});
            sendEmail.send(email, token, 'activate');
            response.status(200, {message:`Confirmation for ${login} send on email`}, res);
        }
        catch (e){
            response.status(500, {message: `${e}`}, res);
        }
    } else{
        response.status(400, {message: `Email - ${email} invalid`}, res)
    }
}

exports.activeEmail = async (req, res) =>{
    const {token} = req.params;
    try{
       const userData = jwt.verify(token, config.jwt);
       await User.register(userData);
       response.status(201, {message:`User ${userData.login} registered`}, res);
    }
    catch (e){
        response.status(500, {message: `${e}`}, res);
    }
}


exports.login = async (req, res) => {
    const {login, password} = req.body;
    const isExistUser = await User.isLoginExist(login);
    if(!isExistUser){
        return response.status(409, {message:`User with login - ${login} does not exist`}, res);
    }
    const userData = await User.login(login);
    console.log(userData);
   const isCorrectPassword = await bcrypt.compare(password, userData[0].password);
   if(isCorrectPassword){
       const token = jwt.sign({
           userId: userData[0].id,
           login: userData[0].login,
           role: userData[0].role
       }, config.jwt, {expiresIn: '30d'});
       await User.updateValues('tmp_token', token, userData[0].id)
        response.status(200, {token: `${token}`}, res)
   }
   else{
       response.status(422, {message: `Passwords do not match`}, res);
   }
}

exports.logout = async (req, res) =>{
    const {token} = req.params;
    const userData = jwt.verify(token, config.jwt);
    await User.updateValues('tmp_token', null, userData.userId);
    response.status(200, {message: `User with login ${userData.login} logged out`}, res);
}

exports.passwordReset = async (req, res) =>{
    const {email} = req.body;
    console.log(email);
    if(await User.isEmailExist(email)){
        try {
            const [{id, login}] = await User.initUser(email);
            console.log(id, login);
            const token = jwt.sign({
                id, login
            }, config.jwt, {expiresIn: '15m'});
            sendEmail.send(email, token);
            response.status(200, {message:`Reset link for ${email} send on email`}, res);
        }
        catch (e){
            response.status(500, {message: `${e}`}, res);
        }
    }else{
        response.status(409, {message:`User with email - ${email} does not exist`}, res);
    }
}
exports.passwordResetWithConfirmToken = async (req, res) =>{
    const {password, confirmPassword} = req.body;
    const {confirm_token} = req.params;
    
    if(password === confirmPassword){
        if(checkPass.passwordStrength(password).value === 'Too weak' || checkPass.passwordStrength(password).value === 'Weak'){
            return response.status(400, {message: 'The password is too easy'}, res);
        }
        const salt = bcrypt.genSaltSync(15);
        const encryptedPass = bcrypt.hashSync(password, salt);
        try{ 
            const userData = jwt.verify(confirm_token, config.jwt); 
            await User.updateValues('password', encryptedPass, userData.id)
            response.status(200, {message:`Password updated`}, res);
        }
        catch(e) {
            response.status(500, {message: `${e}`}, res);
        }
    }
    else{
        response.status(422, {message: `Passwords do not match`}, res);
    }
}


