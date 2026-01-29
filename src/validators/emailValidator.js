import Joi from 'joi';
import expressJoi from 'express-joi-validation';

const createValidator = expressJoi.createValidator;
const validator = createValidator({ passError: true});

const emailBodyValidator = Joi.object({
    email: Joi.string().email().required(),

})
export const emailValidator = validator.body(emailBodyValidator);


