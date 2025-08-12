/**
 * @swagger

 * /auth/login:
 *   post:
 *     summary: Login with username and password
 *     tags: [Auth]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user: 
 *                   type: object
 *                   properties:
 *                     id: 
 *                       type: string
 *                     username: 
 *                       type: string
 *       400:
 *         description: Invalid username or password
 *       404:
 *         description: User not found
 */
