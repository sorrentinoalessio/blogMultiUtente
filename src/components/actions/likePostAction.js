import { actions } from "../../constants/const.js";
import { addLike } from '../../services/likeService.js';
import likeBodyValidator from "../../validators/actions/likeBodyValidator.js"


class LikePostAction {
    #socket = null;
    #user = null;

    constructor(socket, user) {
        this.#socket = socket;
        this.#user = user;
    }

    process() {
        this.#socket.on(actions.LIKE_POST, async (data, ack) => {
            try {
                const userId = this.#user.userId;
                const validatePostId = likeBodyValidator.validate(data);
                const likes = await addLike(validatePostId, userId);
                ack({
                    result: {
                        success: true,
                        postId: likes._id.toString()
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

export default LikePostAction;