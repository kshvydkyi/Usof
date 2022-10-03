const jwt = require('jsonwebtoken');
const User = require('./../models/user');
const response = require('./../response');
const config = require('./../config');

exports.isAutorised = async (req, res, next) => {
    const {token} = req.params;
    try{
        const userData = jwt.verify(token, config.jwt);
        const [{tmp_token}] = await User.getToken(userData.userId);
        if(token !== tmp_token){
            return response.status(401, {message: "unauthorized user"}, res);
        }
        next();
    }
    catch (e) {
        response.status(401, {message: `unauthorized user`}, res);
    }

}



