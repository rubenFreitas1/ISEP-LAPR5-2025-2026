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
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID
 *           example: "507f1f77bcf86cd799439011"
 *         code:
 *           type: string
 *           description: Unique code for the complementary task category
 *           example: "CTC001"
 *         name:
 *           type: string
 *           description: Name of the complementary task category
 *           example: "Equipment calibration"
 *         description:
 *           type: string
 *           description: Detailed description
 *           example: "Equipment calibration related to a task category"
 *         duration:
 *           type: string
 *           description: Default duration or expected impact of a complementary task category
 *           example: "Equipment calibration related to a task category"
 *         lastUpdated:
 *           type: string
 *           format: date-time
 *           description: Timestamp of the last update to the complementary task category
 *         parentIncidentTypeCode:
 *           type: string
 *           description: Code of parent incident type (optional)
 *           example: "INC000"
 */

export interface ComplementaryTaskCategoryDTO {
    id: string;
    code: string;
    name: string;
    description: string;
    duration: string | null;
    lastUpdated: Date;
    parentComplementaryTaskCategoryCode?: string;
}