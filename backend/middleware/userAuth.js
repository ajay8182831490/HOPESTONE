const JWT = require('jsonwebtoken');
const getPool = require('../util/db');
const userSchema = require("../../backend/model/user");
const { logError } = require('../util/logger');
const path = require('path');
const { Types } = require('mongoose');


/*const userAuth = async (req, res, next) => {

    const token = await req.header('Authorization');


    if (!token) {
        res.status(401).send({ error: "please authentication using a valid token" });
    }
    try {
        const data = jwt.verify(token, 'XUcgh3267');// here we insert process env


        req.user = {
            userId: data.user,
            // Add other user-related information if needed
        };
        let conn = await getPool();

        let userinfo = await userSchema.findById(data.user.id);

        if (userinfo.isVerified) {
            next();
        }
        else {
            res.status(401).json("please verify the account");
        }





    } catch (ex) {
        logError(ex, path.basename(__filename));

        res.status(401).send({ error: "internal server error" });

    }

}*/






const userAuth = (req, res, next) => {
    if (!req.headers['authorization']) {
        return next(createError.Unauthorized('Authorization header is missing'));
    }

    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');

    if (bearerToken.length !== 2) {
        return false;
    }

    const token = bearerToken[1];

    try {
        const payload = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Remove surrounding double quotes from the audience
        const userIdString = payload.aud.replace(/^"(.*)"$/, '$1');

        if (!Types.ObjectId.isValid(userIdString)) {
            return res.status(401).send({ error: 'Invalid user ID format' });
        }

        const userId = Types.ObjectId(userIdString);

        req.user = {
            userId: userId,
            // Add other user-related information if needed
        };


        next();
    } catch (err) {
        const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
        return res.status(401).send({ msg: message });
    }
};


module.exports = userAuth;
