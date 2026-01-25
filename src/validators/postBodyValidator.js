import Joi from 'joi';
import expressJoi from 'express-joi-validation';

const createValidator = expressJoi.createValidator;
const validator = createValidator({ passError: true });

const bodyValidator = Joi.object({
    name: Joi.string().required().min(3).max(256),
    description: Joi.string().required().min(3),
    status: Joi.string().valid('open', 'closed'),
    dueDate: Joi.date()

})

export const postBodyValidator = validator.body(bodyValidator);


// export const postBodyValidator = validator.body(Joi.object({
//     name: Joi.string().required().min(3).max(256),
//     description: Joi.string().required().min(3)
// }));