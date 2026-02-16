import { postBodyValidator } from '../validators/postBodyValidator.js'
import { postIdParamValidator } from '../validators/postIdParamsValidator.js';
import checkAuthorizationMiddleware from '../middlewares/checkAuthorizationMiddleware.js';
import { createPost } from '../controllers/postControllers/addPostController.js';
import { getTag, deleteTag} from '../controllers/postControllers/tagPostController.js';
import { getPosts, getPostByIdPostAndUserId, getListPublicPosts, updatePostStatus , getListPublicPost} from '../controllers/postControllers/addPostController.js';
import { postUpdateBodyValidator } from '../validators/postUpdateBodyValidator.js';


export class PostRoutes {
  constructor(router) {
    router.post('/user/post/create', checkAuthorizationMiddleware, postBodyValidator, createPost); //crea post 
    router.get('/user/post/', checkAuthorizationMiddleware, getPosts); //lista post user
    router.get('/user/tag/:id', checkAuthorizationMiddleware, postIdParamValidator, getTag);// lista tag post user
    router.patch('/user/tag/delete/:id', checkAuthorizationMiddleware, postIdParamValidator, deleteTag); // elimina tag da id dell post user
    router.get('/user/post/:id', checkAuthorizationMiddleware, postIdParamValidator, getPostByIdPostAndUserId); // list post by user
    router.get('/post/', getListPublicPosts); // list post public
    router.get('/post/:id',postIdParamValidator, getListPublicPost); // list post public
    router.patch('/user/post/update/:id', checkAuthorizationMiddleware, postUpdateBodyValidator, updatePostStatus); // update post da id post
       
  }
}
