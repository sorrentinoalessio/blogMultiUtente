import { postBodyValidator } from '../validators/postBodyValidator.js'
import { postIdParamValidator } from '../validators/postIdParamsValidator.js';
import checkAuthorizationMiddleware from '../middlewares/checkAuthorizationMiddleware.js';
import { createPost } from '../controllers/postControllers/addPostController.js';
import { getTag } from '../controllers/postControllers/tagPostController.js';
import { getPosts, getPostByIdPostAndUserId, getListPublicPost, updatePostStatus } from '../controllers/postControllers/addPostController.js';
import { postUpdateBodyValidator } from '../validators/postUpdateBodyValidator.js';



/**
 * @swagger
 * /user/post/create:
 *   post:
 *     summary: Crea un nuovo post per l'utente
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Titolo del post"
 *               content:
 *                 type: string
 *                 example: "Contenuto del post"
 *     responses:
 *       201:
 *         description: Post creato con successo
 *       400:
 *         description: Dati mancanti o non validi
 *       401:
 *         description: Utente non autorizzato
 */

/**
 * @swagger
 * /user/post/:
 *   get:
 *     summary: Restituisce tutti i post dell'utente
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista dei post dell'utente
 *       401:
 *         description: Utente non autorizzato
 */

/**
 * @swagger
 * /user/tag/{id}:
 *   get:
 *     summary: Restituisce i post con un tag specifico
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tag
 *     responses:
 *       200:
 *         description: Lista dei post con quel tag
 *       401:
 *         description: Utente non autorizzato
 *       404:
 *         description: Tag non trovato
 */

/**
 * @swagger
 * /user/post/{id}:
 *   get:
 *     summary: Restituisce un post specifico di un utente
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del post
 *     responses:
 *       200:
 *         description: Post trovato
 *       401:
 *         description: Utente non autorizzato
 *       404:
 *         description: Post non trovato
 */

/**
 * @swagger
 * /post/:
 *   get:
 *     summary: Restituisce la lista dei post pubblici
 *     tags:
 *       - Post
 *     responses:
 *       200:
 *         description: Lista dei post pubblici
 */

/**
 * @swagger
 * /user/post/status/{id}:
 *   patch:
 *     summary: Aggiorna lo stato di un post
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "published"
 *     responses:
 *       200:
 *         description: Stato aggiornato
 *       400:
 *         description: Dati non validi
 *       401:
 *         description: Utente non autorizzato
 *       404:
 *         description: Post non trovato
 */




export class PostRoutes {
  constructor(router) {
    router.post('/user/post/create', checkAuthorizationMiddleware, postBodyValidator, createPost);
    router.get('/user/post/', checkAuthorizationMiddleware, getPosts);
    router.get('/user/tag/:id', checkAuthorizationMiddleware, postIdParamValidator, getTag);
    router.get('/user/post/:id', checkAuthorizationMiddleware, postIdParamValidator, getPostByIdPostAndUserId);
    router.get('/post/', getListPublicPost);
    router.patch('/user/post/status/:id', checkAuthorizationMiddleware, postUpdateBodyValidator, updatePostStatus);
       
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