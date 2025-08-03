/**
 * @swagger
 * /order:
 *   get:
 *     summary: Get all orders
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: A list of all orders
 */

/**
 * @swagger
 * /order/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order found
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /user/order:
 *   get:
 *     summary: Get authenticated user's orders
 *     tags: [Order]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Orders retrieved
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: No orders found
 */

/**
 * @swagger
 * /user/order/{orderId}:
 *   get:
 *     summary: Get authenticated user's order by ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order found
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Not authorized to view this order
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Create a new order
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - selectedItems
 *               - address
 *             properties:
 *               selectedItems:
 *                 type: array
 *                 items:
 *                   type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid order request
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Cart is empty or user not found
 */

/**
 * @swagger
 * /order/{id}:
 *   delete:
 *     summary: Delete order by ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /order/user/{userId}:
 *   delete:
 *     summary: Delete all orders by user ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orders deleted successfully
 *       404:
 *         description: No orders found for this user
 */

/**
 * @swagger
 * /order:
 *   delete:
 *     summary: Delete all orders
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: All orders deleted successfully
 *       404:
 *         description: No orders found to delete
 */
