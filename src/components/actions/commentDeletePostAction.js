import { actions } from "../../constants/const.js";
import { deleteComment } from '../../services/commentService.js';

class CommentDeletePostAction {
    #socket = null;
    #user = null;

    constructor(socket, user) {
        this.#socket = socket;
        this.#user = user;
    }
    process() {
        this.#socket.on(actions.COMMENT_DELETE, async (data, ack) => {
            try {
                const userId = this.#user.userId;
                const commentDelete = await deleteComment(userId, data);
                ack({
                    result: {
                        success: true,
                        status: 201,
                        data: commentDelete
                    }
                })
            }

            catch (err) {
                ack({
                    result: {
                        success: false,
                        status: 404,
                        error: err.message.toString()
                    }
                })
            }

            return;
        })
    }
}

export default CommentDeletePostAction;