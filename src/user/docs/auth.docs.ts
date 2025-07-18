/**
 * @swagger

 * /user/login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /user/register:
 *  post:
 *    summary: User registration
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - username
 *              - password
 *              - firstName
 *              - lastName
 *              - email
 *              - birthdate
 *              - phoneNumber
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *              firstName:
 *                type: string
 *              lastName:
 *                type: string
 *              email:
 *                type: string
 *              birthdate:
 *                type: string
 *              phoneNumber:
 *                type: string
 *    responses:
 *      201:
 *        description: User registered successfully
 *      400:
 *        description: Invalid registration data
 */
