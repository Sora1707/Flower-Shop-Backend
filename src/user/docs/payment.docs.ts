/**
 * @swagger
 * components:
 *   schemas:
 *     StripeCard:
 *       type: object
 *       required:
 *         - paymentMethodId
 *         - brand
 *         - exp_month
 *         - exp_year
 *         - last4
 *         - isDefault
 *       properties:
 *         paymentMethodId:
 *           type: string
 *         brand:
 *           type: string
 *         exp_month:
 *           type: number
 *         exp_year:
 *           type: number
 *         last4:
 *           type: string
 *         isDefault:
 *           type: boolean
 */

/**
 * @swagger
 * /user/payment:
 *   get:
 *     summary: Get current user's payment methods
 *     tags: [User/Payment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user payment methods
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StripeCard'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /user/payment:
 *   post:
 *     summary: Add a new payment method
 *     tags: [User/Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentMethodId
 *             properties:
 *               paymentMethodId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment method added successfully
 *       400:
 *         description: Payment method ID is required
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Card error when saving
 */

/**
 * @swagger
 * /user/payment/{id}/set-default:
 *   patch:
 *     summary: Set a payment method as default
 *     tags: [User/Payment]
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
 *         description: Default payment method set successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Card not found
 */

/**
 * @swagger
 * /user/payment/{id}:
 *   delete:
 *     summary: Delete a payment method
 *     tags: [User/Payment]
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
 *         description: Card deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Card not found
 */
