/**
 * @swagger
 * components:
 *   schemas:
 *     UserAvatar:
 *       type: object
 *       properties:
 *        small:
 *          type: string
 *          example: uploads/users/<userId>-small.jpg
 *        medium:
 *          type: string
 *          example: uploads/users/<userId>-medium.jpg
 *        large:
 *          type: string
 *          example: uploads/users/<userId>-large.jpg
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *        _id:
 *          type: string
 *          format: uuid
 *        username:
 *          type: string
 *        firstName:
 *          type: string
 *        lastName:
 *          type: string
 *        email:
 *          type: string
 *          format: email
 *        phoneNumber:
 *          type: string
 *        birthdate:
 *          type: string
 *          format: date
 *        gender:
 *          type: string
 *          enum:
 *            - male
 *            - female
 *            - other
 *        avatar:
 *          $ref: '#/components/schemas/UserAvatar'
 *        createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfileUpadteRequest:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         birthdate:
 *           type: string
 *           format: date
 *         gender:
 *           type: string
 *           enum:
 *             - male
 *             - female
 *             - other
 */

/**
 * @swagger
 * /user/profile:
 *  get:
 *    tags: [User/Profile]
 *    summary: Get current user profile
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Current user profile
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserProfile'
 *      401:
 *       description: Unauthorized
 */

/**
 * @swagger
 * /user/profile:
 *   patch:
 *     tags: [User/Profile]
 *     summary: Update current user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserProfileUpadteRequest'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
