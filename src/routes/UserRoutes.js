import { addUser, confirmRegistration, login, loginPending, resetPassword, userProfile } from '../controllers/userControllers/userController.js';
import { addUserValidator } from '../validators/addUserValidator.js';
import { confirmRegistrationValidator } from '../validators/confirmRegistrationValidator.js';
import { loginValidator } from '../validators/loginValidator.js';
import { emailValidator } from '../validators/emailValidator.js';
import checkAuthorizationMiddleware from '../middlewares/checkAuthorizationMiddleware.js';


export class UserRoutes {
  constructor(router) {
    router.post('/user', addUserValidator, addUser);
    router.get('/user/:id/confirm/:token', confirmRegistrationValidator, confirmRegistration);
    router.post('/user/login', loginValidator, login);
    router.post('/user/pending', loginValidator, loginPending);
    router.post('/user/reset_password', emailValidator, resetPassword);
    router.get('/user/profile',checkAuthorizationMiddleware, userProfile);

  }
}
