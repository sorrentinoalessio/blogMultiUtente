import Joi from "joi";
import baseValidator from "./BaseValidator.js";

class LikeBodyValidator {
    constructor() {
        this._schema = Joi.object({
            postId: Joi.string().required(),
        });
        this.validator = baseValidator(this._schema);
    }

    validate(data) {
        const { error, value } = this.validator.validate(data);
        if (error) throw new Error(error.details[0].message);
        return value;
    }
}

export default new LikeBodyValidator();
