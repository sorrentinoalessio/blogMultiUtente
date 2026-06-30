import { actions } from "../../constants/const.js";
import { getPostsById } from '../../services/postService.js';

class PostListAction {
    #socket = null;
    #user = null;

    constructor(socket, user) {
        this.#socket = socket;
        this.#user = user;
    }
    process() {
        this.#socket.on(actions.LIST_POST, async (data, ack) => {
            try {
                const userId = this.#user.userId;
                const postList = await getPostsById(userId);
                ack({
                    result: {
                        success: true,
                        status: 201,
                        data: postList
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

export default PostListAction;