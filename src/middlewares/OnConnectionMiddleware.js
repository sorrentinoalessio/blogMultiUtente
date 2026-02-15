import CommentPostAction from "../components/actions/commentPostAction.js";
import LikePostAction from "../components/actions/likePostAction.js";

class OnConnectionMiddleware {
    async onConnection(socket, io, next){
        console.log('connected');
        new LikePostAction(socket, socket.data.loggedUser).process();
        new CommentPostAction(socket, socket.data.loggedUser).process();
        socket.emit('connected', socket.data.loggedUser);
        next();
    }
}

export default new OnConnectionMiddleware();