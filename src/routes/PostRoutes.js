import { postBodyValidator } from '../validators/postBodyValidator.js'
import { postIdParamValidator } from '../validators/postIdParamsValidator.js';
import checkAuthorizationMiddleware from '../middlewares/checkAuthorizationMiddleware.js';
import { add } from '../controllers/postControllers/addPostController.js';
import { getTag } from '../controllers/postControllers/tagPostController.js';
import { getPosts, getPostByIdPostAndUserId, getListPublicPost, updatePostStatus } from '../controllers/postControllers/addPostController.js';
import { postUpdateBodyValidator } from '../validators/postUpdateBodyValidator.js';
import imageCreationMiddleware from '../middlewares/imageCreationMiddleware.js';



export class PostRoutes {
  constructor(router) {
    router.post('/user/post/create', checkAuthorizationMiddleware, postBodyValidator, add);
    router.get('/user/post/', checkAuthorizationMiddleware, getPosts);
    router.get('/user/tag/:id', checkAuthorizationMiddleware, postIdParamValidator, getTag);
    router.get('/user/post/:id', checkAuthorizationMiddleware, postIdParamValidator, getPostByIdPostAndUserId);
    router.get('/post/', getListPublicPost);
    router.patch('/user/post/status/:id', checkAuthorizationMiddleware, postUpdateBodyValidator, updatePostStatus);
    router.post("/upload", checkAuthorizationMiddleware, imageCreationMiddleware);
    router.get("/form/upload", (req, res) => {
      res.send(`
    <h1>File Upload Demo</h1>
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="uploadedFile" />
      <button type="submit">Upload</button>
    </form>
  `);
    });
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