/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The cart ID
 *         user:
 *           type: string
 *           description: The ID of the user who owns the cart
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *           description: List of items in the cart
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Cart creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Cart last updated date
 *       required:
 *         - user
 *         - items
 *     CartItem:
 *       type: object
 *       properties:
 *         product:
 *           type: string
 *           description: The ID of the product
 *         quantity:
 *           type: integer
 *           description: Quantity of the product
 *           minimum: 1
 *           default: 1
 *         priceAtAddTime:
 *           type: number
 *           description: Price of the product at the time of adding to the cart
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Cart item creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Cart item last updated date
 *       required:
 *         - product
 *         - quantity
 */