import { IncidentClassification } from "../domain/IncidentQualification";

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
 *           description: Auto-generated ID
 *           example: "507f1f77bcf86cd799439011"
 *         code:
 *           type: string
 *           description: Unique code for the incident type
 *           example: "INC001"
 *         name:
 *           type: string
 *           description: Name of the incident type
 *           example: "Fire Emergency"
 *         description:
 *           type: string
 *           description: Detailed description
 *           example: "Fire-related emergency incident"
 *         classification:
 *           type: string
 *           enum: [Minor, Major, Critical]
 *           description: Classification level
 *           example: "Critical"
 *         parentIncidentTypeCode:
 *           type: string
 *           description: Code of parent incident type (optional)
 *           example: "INC000"
 */
export interface IncidentTypeDTO {
  id: string;
  code: string;
  name: string;
  description: string;
  classification: IncidentClassification;
  parentIncidentTypeCode?: string;
}