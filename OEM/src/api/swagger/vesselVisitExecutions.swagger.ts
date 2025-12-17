/**
 * @swagger
 * components:
 *   schemas:
 *     VesselVisitExecutionDTO:
 *       type: object
 *       required:
 *         - vesselVisitNotificationCode
 *         - arrivalDate
 *       properties:
 *         id:
 *           type: string
 *         code:
 *           type: string
 *         vesselIMO:
 *           type: string
 *         vesselVisitNotificationCode:
 *           type: string
 *         arrivalDate:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [InProgress, Completed]
 *         systemUserID:
 *           type: string
 *         lastUpdated:
 *           type: string
 *           format: date-time
 *       example:
 *         vesselVisitNotificationCode: "2025-PA-000123"
 *         arrivalDate: "2025-12-25T10:30:00Z"
 *         vesselIMO: "9074729"
 */
