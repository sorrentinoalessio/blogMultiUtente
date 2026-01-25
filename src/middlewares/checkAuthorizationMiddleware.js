import jwtUtils from '../utils/CryptoUtils.js';

export default async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if(!authorizationHeader) {
        return res.status(401).send('Unauthorized 1');

    }
    const token = authorizationHeader.split(' ')[1];
    try{
        const jwtDecoded = jwtUtils.verifyJwt(token);
        if(!jwtDecoded) {
            return res.status(401).send('Unauthorized 2');
        }
        req.userId = jwtDecoded.userId;
        next();
    } catch(err) {
        return res.status(401).send('Unauthorized 3');
    }
}