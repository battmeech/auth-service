import { Router } from 'express';
import identify from './identify';
import register from './register';
import login from './login';

export const router = Router();

router.route('/api/auth/register').post(register);
router.route('/api/auth').get(identify).post(login);
