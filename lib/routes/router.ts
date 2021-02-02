import { Router } from 'express';
import identify from './identify';
import register from './register';

export const router = Router();

router.route('/api/auth/register').post(register);
router.route('/api/auth').get(identify);
