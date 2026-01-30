import Joi from 'joi';
import expressJoi from 'express-joi-validation';

const createValidator = expressJoi.createValidator;
const validator = createValidator({ passError: true });

const bodyValidator = Joi.object({
    status: Joi.string().valid('public', 'draft','delete')// status di default mette draft, se messo prende solo public o draft
   })

export const postUpdateBodyValidator = validator.body(bodyValidator);
