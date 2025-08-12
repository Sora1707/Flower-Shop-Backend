/**
 * @swagger
 * tags:
 *   name: Admin/User
 *   description: Admin - User Management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminUser:
 *       allOf:
 *         - $ref: '#/components/schemas/UserProfile'
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *               format: uuid
 *             role:
 *               type: string
 *               enum: [superadmin, admin, user]
 *             addresses:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserAddress'
 *             stripeCustomerId:
 *               type: string
 *             cards:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StripeCard'
 *             createdAt:
 *               type: string
 *               format: date-time
 *             updatedAt:
 *               type: string
 *               format: date-time
 *             passwordChangedAt:
 *               type: string
 *               format: date-time
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminUserPaginateResult:
 *       allOf:
 *         - $ref: '#/components/schemas/PaginateResult'
 *         - type: object
 *           properties:
 *             docs:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AdminUser'
 */

/**
 * @swagger
 * components:
 *   parameters:
 *     UserRole:
 *       name: role
 *       in: query
 *       schema:
 *         type: string
 *       required: false
 *
 *     Username:
 *       name: username
 *       in: query
 *       schema:
 *         type: string
 *       required: false
 */

/**
 * @swagger
 * /admin/user:
 *   get:
 *     summary: Get all users
 *     tags: [Admin/User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PaginatePage'
 *       - $ref: '#/components/parameters/PaginateLimit'
 *       - $ref: '#/components/parameters/PaginateSort'
 *       - $ref: '#/components/parameters/UserRole'
 *       - $ref: '#/components/parameters/Username'
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminUserPaginateResult'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /admin/user/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Admin/User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminUser'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /admin/user/{userId}/role:
 *   patch:
 *     summary: Update user's role by ID
 *     tags: [Admin/User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: true
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [superadmin, admin, user]
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /admin/user/{userId}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Admin/User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 */
