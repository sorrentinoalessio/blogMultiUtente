import Joi from 'joi';
import expressJoi from 'express-joi-validation';

const createValidator = expressJoi.createValidator;
const validator = createValidator({ passError: true });

const bodyValidator = Joi.object({
    title: Joi.string().required().min(3).max(256), // titolo obligatorio
    description: Joi.string().required().min(3),// descrizione obligatorio
    status: Joi.string().valid('public', 'draft').default('draft'),// status di default mette draft, se messo prende solo public o draft
    datePost: Joi.date().default(() => new Date(), 'current date'), // mette data creazione post se non inviato
    tag: Joi.array().items(Joi.string().min(3).max(24)), // tag come array di stringhe
    imagePost: Joi.string()

})

export const postBodyValidator = validator.body(bodyValidator);
