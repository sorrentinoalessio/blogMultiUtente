import { postBodyValidator } from '../validators/postBodyValidator.js'
import { postIdParamValidator } from '../validators/postIdParamsValidator.js';
import checkAuthorizationMiddleware from '../middlewares/checkAuthorizationMiddleware.js';

import { add } from '../controllers/postControllers/addPostController.js';
import { getTag } from '../controllers/postControllers/tagPostController.js';



export class PostRoutes {
  constructor(router) {
    router.post('/', checkAuthorizationMiddleware, postBodyValidator, add);
    router.get('/user/tag/:id',checkAuthorizationMiddleware, postIdParamValidator,getTag);
  }
}


