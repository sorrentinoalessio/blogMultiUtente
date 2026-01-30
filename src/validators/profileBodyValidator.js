import Joi from 'joi';
import expressJoi from 'express-joi-validation';

const createValidator = expressJoi.createValidator;
const validator = createValidator({ passError: true});

const BodyValidator = Joi.object({
    name: Joi.string().min(3).max(256)

})
export const profileBodyValidator = validator.body(BodyValidator);
