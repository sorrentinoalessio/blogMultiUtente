import { postBodyValidator } from '../validators/postBodyValidator.js'
import { postIdParamValidator } from '../validators/postIdParamsValidator.js';
import checkAuthorizationMiddleware from '../middlewares/checkAuthorizationMiddleware.js';
import { createPost } from '../controllers/postControllers/addPostController.js';
import { getTag, deleteTag} from '../controllers/postControllers/tagPostController.js';
import { getPosts, getPostByIdPostAndUserId, getListPublicPost, updatePostStatus } from '../controllers/postControllers/addPostController.js';
import { postUpdateBodyValidator } from '../validators/postUpdateBodyValidator.js';


export class PostRoutes {
  constructor(router) {
    router.post('/user/post/create', checkAuthorizationMiddleware, postBodyValidator, createPost); //crea post 
    router.get('/user/post/', checkAuthorizationMiddleware, getPosts); //lista post user
    router.get('/user/tag/:id', checkAuthorizationMiddleware, postIdParamValidator, getTag);// lista tag post user
    router.patch('/user/tag/delete/:id', checkAuthorizationMiddleware, postIdParamValidator, deleteTag); // elimina tag da id dell post user
    router.get('/user/post/:id', checkAuthorizationMiddleware, postIdParamValidator, getPostByIdPostAndUserId);
    router.get('/post/', getListPublicPost);
    router.patch('/user/post/update/:id', checkAuthorizationMiddleware, postUpdateBodyValidator, updatePostStatus);
       
  }
}

//checkAuthorizationMiddleware,
/*app.get("/", (req, res) => {
  res.send(`
    <h1>File Upload Demo</h1>
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="uploadedFile" />
      <button type="submit">Upload</button>
    </form>
  `);
});*/