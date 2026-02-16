import { actions } from "../../constants/const.js";
import { addComment } from '../../services/commentService.js';
import commentBodyValidator from "../../validators/actions/commentBodyValidator.js"


class CommentPostAction {
    #socket = null;
    #user = null;

    constructor(socket, user) {
        this.#socket = socket;
        this.#user = user;
    }
    process() {

        this.#socket.on(actions.COMMENT_POST, async (data, ack) => {
            try {
                const userId = this.#user.userId;
                const validateData = commentBodyValidator.validate(data);
                const comment = await addComment(validateData, userId);
                ack({
                    result: {
                        success: true,
                        data: comment
                    }
                })
            }

            catch (err) {
                ack({
                    result: {
                        success: false,
                        error: err.message.toString()
                    }
                })
            }

            return;
        })
    }
}

export default CommentPostAction;