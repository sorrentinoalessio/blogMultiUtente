import { postBodyValidator } from '../validators/postBodyValidator.js'
import { postIdParamValidator } from '../validators/postIdParamsValidator.js';
import checkAuthorizationMiddleware from '../middlewares/checkAuthorizationMiddleware.js';

import { add } from '../controllers/postControllers/addPostController.js';
import { getTag } from '../controllers/postControllers/tagPostController.js';
import { getPosts, getPostByIdPostAndUserId, getListPublicPost } from '../controllers/postControllers/addPostController.js';



export class PostRoutes {
  constructor(router) {
    router.post('/user/post/create', checkAuthorizationMiddleware, postBodyValidator, add);
    router.get('/user/post/', checkAuthorizationMiddleware, getPosts);
    router.get('/user/tag/:id', checkAuthorizationMiddleware, postIdParamValidator, getTag);
    router.get('/user/post/:id', checkAuthorizationMiddleware, postIdParamValidator, getPostByIdPostAndUserId);
    router.get('/post/', checkAuthorizationMiddleware, getListPublicPost);
  }
}


