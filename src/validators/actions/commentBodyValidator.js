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
        const { error, value } = this.validator.validate(data);
        if (error) throw new Error(error.details[0].message);
        return value;
    }
}

export default new CommentBodyValidator();
