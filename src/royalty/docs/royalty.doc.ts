/**
 * @swagger
 * tags:
 *   name: Royalty
 *   description: Endpoints for managing user royalty points
 */

/**
 * @swagger
 * /royalty/{userId}/total:
 *   get:
 *     summary: Get total royalty points for a user
 *     tags: [Royalty]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Total royalty points for the user
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /royalty/{userId}/history:
 *   get:
 *     summary: Get royalty point transaction history for a user
 *     tags: [Royalty]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of royalty point transactions
 *       404:
 *         description: User or royalty history not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RoyaltyPoint:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *         points:
 *           type: number
 *         type:
 *           type: string
 *           enum: [EARNED, SPENT, ADJUSTED]
 *         description:
 *           type: string
 *         orderId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */
