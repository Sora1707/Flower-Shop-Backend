/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

/**
 * @swagger
 * tags:
 *   name: User/Profile
 *   description: User Profile
 */

/**
 * @swagger
 * tags:
 *   name: User/Address
 *   description: User Address
 */

/**
 * @swagger
 * tags:
 *   name: User/Payment
 *   description: User Payment
 */

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     tags: [User]
 *     summary: Get user profile by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
