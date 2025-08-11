/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - firstName
 *         - lastName
 *         - email
 *         - birthdate
 *       properties:
 *         username:
 *           type: string
 *           example: sora
 *         password:
 *           type: string
 *           example: sora
 *         firstName:
 *           type: string
 *           example: Sora
 *         lastName:
 *           type: string
 *           example: Takamiya
 *         email:
 *           type: string
 *           format: email
 *         birthdate:
 *           type: string
 *           format: date
 *           example: 2000-01-01
 *         phoneNumber:
 *           type: string
 *           example: 0123456789
 *         gender:
 *           type: string
 *           enum:
 *             - male
 *             - female
 *             - other
 *           example: male
 */

/**
 * @swagger
 * /auth/register:
 *  post:
 *    summary: User registration
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/RegisterRequest'
 *    responses:
 *      201:
 *        description: User registered successfully
 *      400:
 *        description: Bad request
 */
