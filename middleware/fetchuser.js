const jwt = require('jsonwebtoken');
const JWT_SEECRET = 'raviisgood'

const fetchuser = (req, res, next) => {
    //get the use from jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "please authentication using a valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SEECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "please authentication using a valid token from catch" })
    }

}


module.exports = fetchuser;