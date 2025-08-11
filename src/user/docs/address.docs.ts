/**
 * @swagger
 * components:
 *   schemas:
 *     UserAddress:
 *       type: object
 *       required:
 *         - _id
 *         - name
 *         - phoneNumber
 *         - addressLine1
 *         - country
 *         - stateOrProvince
 *         - city
 *         - postalCode
 *         - isDefault
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         addressLine1:
 *           type: string
 *         addressLine2:
 *           type: string
 *         country:
 *           type: string
 *         stateOrProvince:
 *           type: string
 *         city:
 *           type: string
 *         postalCode:
 *           type: string
 *         isDefault:
 *           type: boolean
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserAddressRequest:
 *       type: object
 *       required:
 *         - name
 *         - phoneNumber
 *         - country
 *         - stateOrProvince
 *         - city
 *         - addressLine1
 *         - postalCode
 *       properties:
 *         name:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         country:
 *           type: string
 *         stateOrProvince:
 *           type: string
 *         city:
 *           type: string
 *         addressLine1:
 *           type: string
 *         addressLine2:
 *           type: string
 *         postalCode:
 *           type: string
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserAddressUpdateRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         country:
 *           type: string
 *         stateOrProvince:
 *           type: string
 *         city:
 *           type: string
 *         addressLine1:
 *           type: string
 *         addressLine2:
 *           type: string
 *         postalCode:
 *           type: string
 */

/**
 * @swagger
 * /user/address:
 *   get:
 *     summary: Get current user's addresses
 *     tags: [User/Address]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserAddress'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /user/address:
 *   post:
 *     summary: Add a new address
 *     tags: [User/Address]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserAddressRequest'
 *     responses:
 *       201:
 *         description: Address added successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /user/address/{addressId}/set-default:
 *   patch:
 *     summary: Set default address with addressId
 *     tags: [User/Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */

/**
 * @swagger
 * /user/address/{addressId}:
 *   patch:
 *     summary: Update address with addressId
 *     tags: [User/Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserAddressUpdateRequest'
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */

/**
 * @swagger
 * /user/address/{addressId}:
 *   delete:
 *     summary: Delete address with addressId
 *     tags: [User/Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */
