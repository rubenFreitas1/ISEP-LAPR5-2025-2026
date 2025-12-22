import { IncidentStatus } from "../domain/IncidentStatus";
import { IncidentTypeDTO } from "./IncidentTypeDTO";
import { VesselVisitExecutionDTO } from "./VesselVisitExecutionDTO";
import { IncidentClassification } from "../domain/IncidentQualification";

/**
 * @swagger
 * components:
 *   schemas:
 *     IncidentDTO:
 *       type: object
 *       required:
 *         - incidentTypeCode
 *         - startDate
 *         - status 
 *         - description
 *         - vesselVisitExecutionsCodes
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated unique identifier of the incident
 *           example: "64b7f2c1a9e3f12d4a9c0012"
 *         incidentTypeCode:
 *           type: string
 *           description: Type of the incident
 *           example: "INC001"
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Date and time when the incident started
 *         endDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Date and time when the incident ended (null if still active)
 *           example: "2024-06-01T12:45:00Z"
 *         status:
 *           type: string
 *           enum: [Active, Resolved]
 *           description: Current status of the incident
 *           example: "Active"
 *         description:
 *           type: string
 *           description: Free-text description of the incident
 *           example: "Crane malfunction causing delays in vessel operations"
 *         systemUserID:
 *           type: string
 *           description: Identifier of the user who reported or is responsible for the incident
 *           example: "1"
 *         lastUpdated:
 *           type: string
 *           format: date-time
 *           description: Timestamp of the last update to the incident
 *         classification:
 *           type: string
 *           enum: [Minor, Major, Critical]
 *           description: Classification level
 *           example: "Critical"
 *         duration:
 *           type: number
 *           nullable: true
 *           description: Duration of the incident in hours 
 *         vesselVisitExecutionsCodes:
 *           type: array
 *           description: List of vessel visit executions affected by the incident
 */

export interface IncidentDTO {
  id: string;
  incidentTypeByCode: string;
  startDate: Date;
  endDate: Date | null;
  status: IncidentStatus;
  description: string;
  systemUserID: string;
  lastUpdated: Date;
  classification: IncidentClassification;
  duration: number | null;
  vesselVisitExecutionsCodes: string[] | null;
}