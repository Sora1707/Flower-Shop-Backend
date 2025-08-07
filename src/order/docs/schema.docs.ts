/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Order management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The order ID
 *         user:
 *           type: string
 *           description: The ID of the user who placed the order
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *           description: List of items in the order
 *         status:
 *           type: string
 *           enum: [PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED]
 *           description: Current status of the order
 *           default: PENDING
 *         paymentMethod:
 *           type: string
 *           enum: [CREDIT_CARD, DEBIT_CARD, PAYPAL, CASH_ON_DELIVERY]
 *           description: Payment method used for the order
 *         contactInfo:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Full name of the contact person
 *             phoneNumber:
 *               type: string
 *               description: Contact phone number
 *             postalCode:
 *               type: string
 *               description: Postal code for the shipping address
 *             address:
 *               type: string
 *               description: Shipping address
 *           required:
 *             - name
 *             - phoneNumber
 *             - postalCode
 *             - address
 *           description: Contact information for the order
 *         shippingPrice:
 *           type: number
 *           description: Shipping cost for the order
 *         totalPrice:
 *           type: number
 *           description: Total price of the order (including shipping)
 *         isPaid:
 *           type: boolean
 *           description: Indicates if the order has been paid
 *           default: false
 *         paidAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the order was paid
 *         isDelivered:
 *           type: boolean
 *           description: Indicates if the order has been delivered
 *           default: false
 *         deliveredAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the order was delivered
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Order creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Order last updated date
 *       required:
 *         - user
 *         - items
 *         - paymentMethod
 *         - contactInfo
 *         - shippingPrice
 *         - totalPrice
 *     OrderItem:
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
 *           description: Price of the product at the time of adding to the order
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Order item creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Order item last updated date
 *       required:
 *         - product
 *         - quantity
 */