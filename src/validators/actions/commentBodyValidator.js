import Joi from "joi";
import baseValidator from "./BaseValidator.js";

class CommentBodyValidator {
    constructor() {
        this._schema = Joi.object({
            postId: Joi.string().required(),
            comment: Joi.string().required().min(3),
        });
        this.validator = baseValidator(this._schema);
    }

    validate(data) {
        return this.validator.validate(data);
    }
}

export default new CommentBodyValidator();
