const express = require("express");
// const User = require("@@models/user");
const jwt = require("jsonwebtoken");

/*
    Création du middleware d'authentification
    Le token est présent dans le Header
*/


module.exports = function({ User }){
    return async (req, res, next) => {
        try {
            const { token } = req.cookies;
            const decodedToken = jwt.verify(
                token, 
                process.env.SECRET_TOKEN, 
                { 
                    algorithms: [ 'HS256' ] 
                }
            );
            const { sub } = decodedToken;

            // console.log(decodedToken , sub);

            let connectedUser = await User.findOne({
                where: {
                username: sub,
                }
            })
            //   console.log(connectedUser);
            req.user = connectedUser;
            // socket.user = await User.findById(userId);
            next();
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
}