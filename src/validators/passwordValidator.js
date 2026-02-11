import Joi from 'joi';
import expressJoi from 'express-joi-validation';

const createValidator = expressJoi.createValidator;
const validator = createValidator({ passError: true});

const bodyPasswordValidator = Joi.object({
    passwordNew: Joi.string().required().min(3)
})

export const passwordValidator = validator.body(bodyPasswordValidator);
