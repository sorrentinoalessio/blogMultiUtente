import { actions } from "../../constants/const.js";
import { listComment } from '../../services/commentService.js';

class CommentListPostAction {
    #socket = null;
    #user = null;

    constructor(socket, user) {
        this.#socket = socket;
        this.#user = user;
    }
    process() {
        this.#socket.on(actions.COMMENT_LIST, async (data, ack) => {
            try {
                const userId = this.#user.userId;
                const commentList = await listComment(userId);
                ack({
                    result: {
                        success: true,
                        status: 201,
                        data: commentList
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

export default CommentListPostAction;