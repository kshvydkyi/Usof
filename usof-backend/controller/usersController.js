'use strict'

const response = require('./../response');
const User = require('./../models/user');
const bcrypt = require("bcryptjs");
const multer = require('multer');
const jwt = require('jsonwebtoken');
const config = require('./../config');

exports.getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.getAllUsers();
        response.status(200, allUsers, res);
    }
    catch(e){
        response.status(400, {message: `${e}`}, res);
    }

}
exports.addNewUser = async (req, res) => {
    const token = req.params.token;
    const userData = jwt.verify(token, config.jwt);
    const isAdmin = await User.isAdmin(userData.userId);
    if(!isAdmin){
        return response.status(403, {message:"Access denied"}, res)
    }
    const {
        login, password, passwordConfirmation, fullName, email, role
    } = req.body;
    if(!login || !password || !passwordConfirmation || !fullName || !email || !role) return response.status(400, {message:`Fill in all fields`}, res);
    if(password !== passwordConfirmation) return response.status(400, {message: `Passwords do not match`}, res);
    if(await User.isLoginExist(login)){
        return response.status(409, {message:`User with login - ${login} already exist`}, res);

    }
    else if(await User.isEmailExist(email)){
        return response.status(409, {message:`User with email - ${email} already exist`}, res);
    }
    const salt = bcrypt.genSaltSync(15);
    const encryptedPass = bcrypt.hashSync(password, salt);
    try {
        await User.addNewUser(req.body, encryptedPass);
        response.status(200, {message:`User ${login} added`}, res);
    }
    catch (e){
        response.status(500, {message: `${e}`}, res);
    }
}
exports.getUserById = async (req, res) => {
    let id = req.params.user_id;
    const user = await User.getUserById(id);
    if(!user){
        return response.status(404, {message: `User with id = ${id} not found`}, res);
    }
    response.status(200, user, res);
}

exports.uploadAvatar = async (req, res) => {
    // const pathFile = req.file.path.split('\\').join('/');
    const pathFile = req.file.filename;
    console.log(pathFile)
    const token = req.params.token;
    const userData = jwt.verify(token, config.jwt);
    try{
        await User.uploadAvatar(pathFile, userData.userId);
        response.status(200, {message:`Avatar changed`}, res);
    }
    catch (e){
        response.status(500, {message: `${e}`}, res);
    }
}

exports.updateUserData = async (req, res) => {
    const id = req.params.user_id;
    const token = req.params.token;
    const userData = jwt.verify(token, config.jwt);
    if(+id !== userData.userId){
        return response.status(403, {message:"Access denied"}, res)
    }
    if(await User.isLoginExist(req.body.login)){
        return response.status(409, {message:`User with login - ${req.body.login} already exist`}, res);

    }
    else if(await User.isEmailExist(req.body.email)){
        return response.status(409, {message:`User with email - ${req.body.email} already exist`}, res);
    }
    try{
        await User.updateUserData(req.body, req.params.user_id);
        response.status(200, {message:`Values changed`}, res);
    }
    catch (e){
        response.status(500, {message: `${e}`}, res);
    }

}
exports.deleteUser = async (req, res) => {
    const id = req.params.user_id;
    const token = req.params.token;
    const userData = jwt.verify(token, config.jwt);
    if(+id !== userData.userId || userData.role !== 'Admin'){
        return response.status(403, {message:"Access denied"}, res)
    }
    const user = await User.getUserById(id);

    if(!user){
        return response.status(404, {message: `User with id = ${id} not found`}, res);
    }
    await User.deleteUser(id);
    response.status(200, {message: `User with id = ${id} deleted`}, res);
}


