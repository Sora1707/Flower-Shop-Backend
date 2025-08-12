/**
 * @swagger
 * tags:
 *   name: Admin/Product
 *   description: Admin - Product Management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductPost:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - price
 *         - stock
 *         - isAvailable
 *       properties:
 *         name:
 *           type: string
 *         type:
 *           type: string
 *           enum: [flower, vase]
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: number
 *         isAvailable:
 *           type: boolean
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         type:
 *           type: string
 *           enum: [flower, vase]
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: number
 *         isAvailable:
 *           type: boolean
 */

/**
 * @swagger
 * /admin/product:
 *   post:
 *     summary: Create a new product
 *     tags: [Admin/Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductPost'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /admin/product/{productId}:
 *   patch:
 *     summary: Update a product
 *     tags: [Admin/Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdate'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /admin/product/{productId}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Admin/Product]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Product not found
 */
