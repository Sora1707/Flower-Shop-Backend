/**
 * @swagger
 * /auth/request-password-reset:
 *   post:
 *     summary: Request password reset with email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset link sent to email
 *       400:
 *         description: Invalid email address
 *       404:
 *         description: Email has not been registered
 */
