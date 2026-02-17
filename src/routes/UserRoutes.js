import { addUser, confirmRegistration, login, loginPending, resetPassword, userProfile, updateProfile, cofirmUserResetPassword, newPassword } from '../controllers/userControllers/userController.js';
import { addUserValidator } from '../validators/addUserValidator.js';
import { confirmRegistrationValidator } from '../validators/confirmRegistrationValidator.js';
import { loginValidator } from '../validators/loginValidator.js';
import { emailValidator } from '../validators/emailValidator.js';
import { passwordValidator } from '../../src/validators/passwordValidator.js';
import { profileBodyValidator } from '../validators/profileBodyValidator.js'
import checkAuthorizationMiddleware from '../middlewares/checkAuthorizationMiddleware.js';
import imageCreationMiddleware from '../middlewares/imageCreationMiddleware.js';
import { confirmTokenValidator } from '../validators/confirmTokenResetPassValidator.js'


export class UserRoutes {
  constructor(router) {
    router.post('/user', addUserValidator, addUser);
    router.get('/user/:id/confirm/:token', confirmRegistrationValidator, confirmRegistration);
    router.post('/user/login', loginValidator, login);
    router.post('/user/pending', loginValidator, loginPending);
    router.post('/user/reset_password', emailValidator, resetPassword);
    router.get('/user/profile', checkAuthorizationMiddleware, userProfile);
    router.patch('/user/profile/update', checkAuthorizationMiddleware, profileBodyValidator, updateProfile);
    router.post("/user/profile/avatar/upload", checkAuthorizationMiddleware, imageCreationMiddleware);
    router.get('/user/reset/:token', confirmTokenValidator, cofirmUserResetPassword);
    router.post('/user/new_password/:token', passwordValidator, newPassword);
  }
}
