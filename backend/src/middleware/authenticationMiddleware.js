const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {

    if(req.headers && req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        let token =  req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({ message: 'Unauthorized: Missing token.' });
        }else{
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if (err) 
                    return res.status(403).json({ message: 'Forbidden: Invalid token' });
                req.user = decoded;
                next();
            });
        }
    }else{
        return res.status(401).json({ message: 'Unauthorized: Missing Header Authorization.' });
    }   
}

module.exports = authenticate;


