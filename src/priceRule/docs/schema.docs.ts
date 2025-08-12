/**
 * @swagger
 * tags:
 *   name: PriceRule
 *   description: Price rule management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PriceRule:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The price rule ID
 *         type:
 *           type: string
 *           enum: [DailyDecrease, Promotion]
 *           description: The type of price rules
 *         active:
 *           type: boolean
 *           description: The status of the price rule
 *           default: true
 *         startDate:
 *           type: date
 *           description: The start date to apply the price rule
 *         endDate:
 *           type: date
 *           description: The end date to apply the price rule
 *         discountAmount:
 *           type: number
 *           description: The amount of the applied discount
 *         occasion:
 *           type: string
 *           description: The occasion to apply the price rule
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Order item creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Order item last updated date
 */