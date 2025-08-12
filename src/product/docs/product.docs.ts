/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         type:
 *           type: string
 *           enum: [flower, vase]
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         originalPrice:
 *           type: number
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         stock:
 *           type: number
 *         isAvailable:
 *           type: boolean
 *         rating:
 *           type: object
 *           properties:
 *             average:
 *               type: number
 *             count:
 *               type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductPaginateResult:
 *       allOf:
 *         - $ref: '#/components/schemas/PaginateResult'
 *         - type: object
 *           properties:
 *             docs:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * components:
 *   parameters:
 *     ProductKeyword:
 *       in: query
 *       name: keyword
 *       schema:
 *         type: string
 *       required: false
 *       description: Keyword to search for products
 *
 *     ProductType:
 *       in: query
 *       name: type
 *       schema:
 *         type: string
 *       required: false
 *       description: Type of product to search for
 *
 *     ProductMinPrice:
 *       in: query
 *       name: minPrice
 *       schema:
 *         type: string
 *       required: false
 *       description: Minimum price of product to search for
 *
 *     ProductMaxPrice:
 *       in: query
 *       name: maxPrice
 *       schema:
 *         type: string
 *       required: false
 *       description: Maximum price of product to search for
 */

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Get all products with filters
 *     tags: [Product]
 *     parameters:
 *       - $ref: '#/components/parameters/PaginatePage'
 *       - $ref: '#/components/parameters/PaginateLimit'
 *       - $ref: '#/components/parameters/PaginateSort'
 *       - $ref: '#/components/parameters/ProductKeyword'
 *       - $ref: '#/components/parameters/ProductType'
 *       - $ref: '#/components/parameters/ProductMinPrice'
 *       - $ref: '#/components/parameters/ProductMaxPrice'
 *     responses:
 *       200:
 *         description: A list of products in paginate form
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductPaginateResult'
 */

/**
 * @swagger
 * /product/flower:
 *   get:
 *     summary: Get all products with filters
 *     tags: [Product]
 *     parameters:
 *       - $ref: '#/components/parameters/PaginatePage'
 *       - $ref: '#/components/parameters/PaginateLimit'
 *       - $ref: '#/components/parameters/PaginateSort'
 *       - $ref: '#/components/parameters/ProductKeyword'
 *       - $ref: '#/components/parameters/ProductMinPrice'
 *       - $ref: '#/components/parameters/ProductMaxPrice'
 *     responses:
 *       200:
 *         description: A list of flowers in paginate form
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductPaginateResult'
 */

/**
 * @swagger
 * /product/vase:
 *   get:
 *     summary: Get all products with filters
 *     tags: [Product]
 *     parameters:
 *       - $ref: '#/components/parameters/PaginatePage'
 *       - $ref: '#/components/parameters/PaginateLimit'
 *       - $ref: '#/components/parameters/PaginateSort'
 *       - $ref: '#/components/parameters/ProductKeyword'
 *       - $ref: '#/components/parameters/ProductMinPrice'
 *       - $ref: '#/components/parameters/ProductMaxPrice'
 *     responses:
 *       200:
 *         description: A list of vases in paginate form
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductPaginateResult'
 */

/**
 * @swagger
 * /product/{productId}:
 *   get:
 *     summary: Get product by productId
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /product/serach:
 *   get:
 *     summary: Get all products with filters
 *     tags: [Product]
 *     parameters:
 *       - $ref: '#/components/parameters/PagiantePage'
 *       - $ref: '#/components/parameters/PaginateLimit'
 *       - $ref: '#/components/parameters/PaginateSort'
 *       - $ref: '#/components/parameters/ProductKeyword'
 *       - $ref: '#/components/parameters/ProductType'
 *       - $ref: '#/components/parameters/ProductMinPrice'
 *       - $ref: '#/components/parameters/ProductMaxPrice'
 *     responses:
 *       200:
 *         description: A list of products in paginate form
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductPaginateResult'
 */

/**
 * @swagger
 * /product/autocomplete:
 *   get:
 *     summary: Autocomplete product names
 *     tags: [Product]
 *     parameters:
 *       - $ref: '#/components/parameters/ProductKeyword'
 *     responses:
 *       200:
 *         description: Autocomplete suggestions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
