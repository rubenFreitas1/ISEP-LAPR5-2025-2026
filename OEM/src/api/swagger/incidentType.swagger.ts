/**
 * @swagger
 * components:
 *   schemas:
 *     IncidentTypeDTO:
 *       type: object
 *       required:
 *         - code
 *         - name
 *         - description
 *         - classification
 *       properties:
 *         id:
 *           type: string
 *         code:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         classification:
 *           type: string
 *           enum: [Minor, Major, Critical]
 *         parentIncidentTypeCode:
 *           type: string
 *           nullable: true
 */
