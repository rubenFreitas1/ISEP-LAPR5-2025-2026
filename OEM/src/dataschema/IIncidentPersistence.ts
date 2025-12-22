import { IncidentClassification } from "../domain/IncidentQualification";
import { IncidentStatus } from "../domain/IncidentStatus";

export interface IIncidentPersistence {
    _id: string;
    incidentTypeCode: string;
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