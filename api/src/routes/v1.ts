import { Router } from 'express';
import { actionDispatch } from '@/core/utils/action-dispatcher';
import { AuthController } from '@/controllers/auth.controller';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { DocusignController } from '@/controllers/docusign.controller';
import { DocumentController } from '@/controllers/document.controller';

const auth = new AuthMiddleware().handle;

const router = Router();

/*
|--------------------------------------------------------------------------
| Auth routes
|--------------------------------------------------------------------------
*/
router.post('/auth/register', actionDispatch(new AuthController().register));
router.get('/auth/account-verify', actionDispatch(new AuthController().accountVerify));
router.post('/auth/token', actionDispatch(new AuthController().authToken));
router.post('/auth/refresh-token', actionDispatch(new AuthController().refreshToken));
router.post('/auth/forgot-password', actionDispatch(new AuthController().forgotPassword));
router.post('/auth/reset-password', actionDispatch(new AuthController().resetPassword));
router.post('/auth/me', auth, actionDispatch(new AuthController().me));
router.post('/auth/logout', auth, actionDispatch(new AuthController().logout));

/*
|--------------------------------------------------------------------------
| Docusign routes
|--------------------------------------------------------------------------
*/
router.get('/docusign/auth', auth, actionDispatch(new DocusignController().auth));
router.get('/docusign/auth/callback', actionDispatch(new DocusignController().authCallback));
router.post('/docusign/webhook', actionDispatch(new DocusignController().webhook));

/*
|--------------------------------------------------------------------------
| Document routes
|--------------------------------------------------------------------------
*/
router.get('/document/analytic', auth, actionDispatch(new DocumentController().analytic));
router.get('/document', auth, actionDispatch(new DocumentController().all));
router.post('/document', auth, actionDispatch(new DocumentController().store));
router.get('/document/:id', auth, actionDispatch(new DocumentController().show));
router.put('/document/:id', auth, actionDispatch(new DocumentController().update));
router.delete('/document/:id', auth, actionDispatch(new DocumentController().delete));
router.get('/document/:id/send', auth, actionDispatch(new DocumentController().send));

/*
|--------------------------------------------------------------------------
| Profile routes
|--------------------------------------------------------------------------
*/
router.post('/profile', auth, actionDispatch(new AuthController().updateProfile));

export default router;
