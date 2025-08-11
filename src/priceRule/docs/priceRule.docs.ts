/**
 * @swagger
 * /price-rule/all:
 *   get:
 *     summary: Get all price rules
 *     tags: [PriceRule]
 *     responses:
 *       200:
 *         description: A list of all price rules
 */

/**
 * @swagger
 * /price-rule/{id}:
 *   get:
 *     summary: Get a price rule by ID
 *     tags: [PriceRule]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Price rule found
 *       404:
 *         description: Price rule not found
 */

/**
 * @swagger
 * /price-rule:
 *   post:
 *     summary: Create a new price rule
 *     tags: [PriceRule]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - discountAmount
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [PERCENTAGE, FIXED]
 *               discountAmount:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Price rule created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /price-rule/{id}:
 *   patch:
 *     summary: Update a price rule
 *     tags: [PriceRule]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields to update in the price rule
 *     responses:
 *       200:
 *         description: Price rule updated
 *       404:
 *         description: Price rule not found
 */

/**
 * @swagger
 * /price-rule/{id}:
 *   delete:
 *     summary: Delete a price rule
 *     tags: [PriceRule]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Price rule deleted
 *       404:
 *         description: Price rule not found
 */
