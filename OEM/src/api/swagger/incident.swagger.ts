/**
 * @swagger
 * components:
 *   schemas:
 *     IncidentDTO:
 *       type: object
 *       required:
 *         - incidentTypeByCode
 *         - startDate
 *         - status
 *         - description
 *       properties:
 *         id:
 *           type: string
 *         incidentTypeByCode:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [Active, Resolved]
 *         description:
 *           type: string
 *         systemUserID:
 *           type: string
 *         lastUpdated:
 *           type: string
 *           format: date-time
 *         duration:
 *           type: number
 *           nullable: true
 *         vesselVisitExecutionsCodes:
 *           type: array
 *           items:
 *             type: string
 *           nullable: true
 */
