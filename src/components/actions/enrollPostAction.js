import { actions } from "../../constants/const.js";
import { addLike } from '../../services/enrollService.js';
import enrollBodyValidator from "../../validators/actions/enrollBodyValidator.js";

class LikePostAction {
    #socket = null;
    #user = null;

    constructor(socket, user) {
        this.#socket = socket;
        this.#user = user;
    }

    process() {
          this.#socket.on(actions.ENROLL_POST, async (data, ack) => {
            try {
                const dataValidate = enrollBodyValidator.validate(data);
                const enroll = await addLike(dataValidate, this.#user.userId);
                ack({
                    result: {
                        success: true,
                        data: enroll
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


