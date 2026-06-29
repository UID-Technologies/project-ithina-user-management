import { Router } from 'express';
import { authMiddleware } from '../../common/middlewares/auth.middleware';
import { validateBody } from '../../common/validators/validate.middleware';
import { authController } from './auth.controller';
import { loginSchema } from './auth.schema';

const router = Router();

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Authenticate and receive JWT
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', validateBody(loginSchema), authController.login);

/**
 * @openapi
 * /api/v1/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Current authenticated profile
 *     responses:
 *       200:
 *         description: Enriched profile with persona fields
 */
router.get('/me', authMiddleware, authController.me);

export default router;
