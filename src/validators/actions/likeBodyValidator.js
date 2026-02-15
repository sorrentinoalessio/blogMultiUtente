import Joi from "joi";
import baseValidator from "./BaseValidator.js";

class LikeBodyValidator {
    constructor() {
        this._schema = Joi.object({
            postId: Joi.string().hex().length(24).required(),
        });
        this.validator = baseValidator(this._schema);
    }

    validate(data) {
        return this.validator.validate(data); 
    }
}

export default new LikeBodyValidator();
