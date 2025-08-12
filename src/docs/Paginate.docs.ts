/**
 * @swagger
 * components:
 *   schemas:
 *     PaginateResult:
 *       type: object
 *       required:
 *         - docs
 *         - totalDocs
 *         - limit
 *         - hasPrevPage
 *         - hasNextPage
 *         - totalPages
 *         - pagingCounter
 *       properties:
 *         docs:
 *           type: array
 *           items:
 *             type: object
 *         totalDocs:
 *           type: number
 *         limit:
 *           type: number
 *         page:
 *           type: number
 *         totalPages:
 *           type: number
 *         pagingCounter:
 *           type: number
 *         hasPrevPage:
 *           type: boolean
 *         hasNextPage:
 *           type: boolean
 *         prevPage:
 *           type: number
 *         nextPage:
 *           type: number
 */

/**
 * @swagger
 * components:
 *   parameters:
 *     PaginatePage:
 *       in: query
 *       name: page
 *       schema:
 *         type: string
 *       required: false
 *       description: Page number for pagination
 *       example: 1
 *
 *     PaginateLimit:
 *       in: query
 *       name: limit
 *       schema:
 *         type: string
 *       required: false
 *       description: Number of items per page
 *       example: 10
 *
 *     PaginateSort:
 *       in: query
 *       name: sort
 *       schema:
 *         type: string
 *       required: false
 *       description: Field to sort by
 *
 *     PaginateOrder:
 *       in: query
 *       name: order
 *       schema:
 *         type: string
 *       required: false
 *       description: Sort order (asc or desc)
 */
