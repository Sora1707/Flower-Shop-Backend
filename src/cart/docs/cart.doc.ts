/**
 * @swagger
 * /cart/all:
 *   get:
 *     summary: Get all carts
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: A list of all carts
 */

/**
 * @swagger
 * /cart/{userId}:
 *   get:
 *     summary: Get cart by user ID
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart found
 *       404:
 *         description: Cart not found
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get authenticated user's cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart found
 *       404:
 *         description: Cart not found
 */

/**
 * @swagger
 * /{productId}/cart:
 *   post:
 *     summary: Add or update an item in the cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item added or updated in the cart
 *       404:
 *         description: Cart not found
 */

/**
 * @swagger
 * /cart:
 *   patch:
 *     summary: Update item quantity in the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successfully updated item quantity
 *       404:
 *         description: Product or cart not found
 *       400:
 *         description: Invalid quantity
 */

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       404:
 *         description: Cart not found
 */

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Clear the authenticated user's cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       404:
 *         description: Cart not found
 */

/**
 * @swagger
 * /cart/{userId}:
 *   delete:
 *     summary: Delete cart by user ID
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart deleted successfully
 *       404:
 *         description: Cart not found
 */
