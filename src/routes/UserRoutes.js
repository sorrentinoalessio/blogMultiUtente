import { addUser, confirmRegistration, login, loginPending, resetPassword, userProfile, updateProfile } from '../controllers/userControllers/userController.js';
import { addUserValidator } from '../validators/addUserValidator.js';
import { confirmRegistrationValidator } from '../validators/confirmRegistrationValidator.js';
import { loginValidator } from '../validators/loginValidator.js';
import { emailValidator } from '../validators/emailValidator.js';
import { profileBodyValidator } from '../validators/profileBodyValidator.js'
import checkAuthorizationMiddleware from '../middlewares/checkAuthorizationMiddleware.js';

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Crea un nuovo utente
 *     tags:
 *       - Utente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mario Rossi
 *               email:
 *                 type: string
 *                 example: mario@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       201:
 *         description: Utente creato con successo
 *       400:
 *         description: Dati non validi
 */

/**
 * @swagger
 * /user/:id/confirm/:token:
 *   get:
 *     summary: Conferma la registrazione dell'utente
 *     tags:
 *       - Utente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dell'utente
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token di conferma
 *     responses:
 *       200:
 *         description: Registrazione confermata
 *       400:
 *         description: Token non valido
 *       404:
 *         description: Utente non trovato
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login dell'utente
 *     tags:
 *       - Utente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: mario@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login riuscito
 *       401:
 *         description: Credenziali non valide
 */

/**
 * @swagger
 * /user/pending:
 *   post:
 *     summary: Login utenti in stato pending
 *     tags:
 *       - Utente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: mario@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login pending riuscito
 *       401:
 *         description: Utente non autorizzato
 */

/**
 * @swagger
 * /user/reset_password:
 *   post:
 *     summary: Richiesta reset password
 *     tags:
 *       - Utente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: mario@example.com
 *     responses:
 *       200:
 *         description: Email di reset inviata
 *       400:
 *         description: Dati non validi
 */

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Restituisce il profilo dell'utente autenticato
 *     tags:
 *       - Utente
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profilo utente
 *       401:
 *         description: Utente non autorizzato
 */

/**
 * @swagger
 * /user/profile/update:
 *   patch:
 *     summary: Aggiorna il profilo dell'utente
 *     tags:
 *       - Utente
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mario Rossi
 *               email:
 *                 type: string
 *                 example: mario@example.com
 *     responses:
 *       200:
 *         description: Profilo aggiornato
 *       400:
 *         description: Dati non validi
 *       401:
 *         description: Utente non autorizzato
 */


export class UserRoutes {
  constructor(router) {
    router.post('/user', addUserValidator, addUser);
    router.get('/user/:id/confirm/:token', confirmRegistrationValidator, confirmRegistration);
    router.post('/user/login', loginValidator, login);
    router.post('/user/pending', loginValidator, loginPending);
    router.post('/user/reset_password', emailValidator, resetPassword);
    router.get('/user/profile', checkAuthorizationMiddleware, userProfile);
    router.patch('/user/profile/update', checkAuthorizationMiddleware,profileBodyValidator, updateProfile);

  }
}
