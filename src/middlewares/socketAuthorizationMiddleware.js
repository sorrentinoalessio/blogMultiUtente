import UnauthorizedException from '../exceptions/UnauthorizedException.js';
import jwtUtils from '../utils/CryptoUtils.js';

export default (socket, next) => {
      const token = socket.handshake.auth?.accessToken;
    if (!token) {
        return next(new UnauthorizedException('Token mancante'));
    }
    try {
           const loggedUser = jwtUtils.verifyJwt(token);
        if (loggedUser && loggedUser.userId) {
            socket.data.loggedUser = loggedUser;
            return next(); 
        }
        return next(new UnauthorizedException('Token non valido: dati utente mancanti'));
    } catch (err) {
        console.error("JWT Auth Error:", err.message);
        return next(new UnauthorizedException('Sessione scaduta o non valida'));
    }
}