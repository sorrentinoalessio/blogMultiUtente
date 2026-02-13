import { actions } from "../constants/const.js";
import { addLike } from "../services/likeService.js";
import { addComment } from "../services/commentService.js";

class OnConnectionMiddleware {
    async onConnection(socket, io, next){
        console.log('connected socket');
        socket.on(actions.COMMENT_POST, async (comment, callback) => {
            try {
                if (!socket.data.loggedUser) {
                    return callback({ error: "User not logged in" });
                }
                const savedComment = await addComment(comment, socket.data.loggedUser.userId);
                callback({ result: { data: savedComment } });
            } catch (err) {
                callback({ error: err.message });
            }
        });

                socket.on(actions.LIKE_POST, async (data, callback) => {
            try {
                if (!socket.data.loggedUser) {
                    return callback({ error: "User not logged in" });
                }
                const savedlike = await addLike(data, socket.data.loggedUser.userId);
                callback({ result: { data: savedlike } });
            } catch (err) {
                callback({ error: err.message });
            }
        });



        socket.emit('connected', socket.data.loggedUser);
        next();
    }
}

export default new OnConnectionMiddleware();
