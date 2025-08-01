/**
 * @swagger
 * /user/me:
 *  get:
 *    tags: [User]
 *    summary: Get current user profile
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Current user profile
 *        content:
 *          application/json:
 *            schema:
 *              allOf:
 *                - $ref: '#/components/schemas/ApiSuccess'
 *                - type: object
 *                  properties:
 *                   data:
 *                    type: object
 *                    properties:
 *                      user:
 *                        $ref: '#/components/schemas/UserProfile'
 *      401:
 *       description: Unauthorized
 */
