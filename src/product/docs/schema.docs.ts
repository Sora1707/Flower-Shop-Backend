/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The product ID
 *         name:
 *           type: string
 *           description: Name of the product
 *         price:
 *           type: number
 *           description: Base price of the product
 *         dailyRuleId:
 *           type: string
 *           description: ID of the daily rule applied to the product
 *         promotionId:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs of promotions applied to the product
 *         description:
 *           type: string
 *           description: Description of the product
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *           description: Categories the product belongs to
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs of product images
 *         stock:
 *           type: number
 *           description: Available stock quantity
 *         isAvailable:
 *           type: boolean
 *           description: Indicates if the product is available
 *         rating:
 *           type: object
 *           properties:
 *             average:
 *               type: number
 *               description: Average rating of the product
 *             count:
 *               type: number
 *               description: Number of ratings
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Product creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Product last updated date
 *       required:
 *         - name
 *         - price
 *         - dailyRuleId
 *         - description
 */