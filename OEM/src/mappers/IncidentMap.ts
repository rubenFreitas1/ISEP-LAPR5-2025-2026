import { Incident } from "../domain/Incident";
import { IIncidentPersistence } from "../dataschema/IIncidentPersistence";
import { IncidentDTO } from "../dto/IncidentDTO";

export class IncidentMap {

    public static toDomain(raw: IIncidentPersistence | any): Incident {
        const incidentType = typeof raw.incidentTypeCode === 'object' && raw.incidentTypeCode !== null 
            ? raw.incidentTypeCode 
            : raw.incidentTypeCode;

        const vesselVisitExecutions = Array.isArray(raw.vesselVisitExecutionsCodes)
            ? raw.vesselVisitExecutionsCodes.map((vve: any) => 
                typeof vve === 'object' && vve !== null ? vve : vve
            )
            : null;

        return new Incident(
            raw._id ? raw._id.toString() : "",
            incidentType,
            raw.startDate,
            raw.endDate,
            raw.status,
            raw.description,
            raw.systemUserID,
            raw.lastUpdated,
            raw.duration ?? null,
            vesselVisitExecutions
        );
    }

    public static toPersistence(incident: Incident): IIncidentPersistence {
        const persistence: any = {
            incidentTypeCode: incident.incidentType.code,
            startDate: incident.startDate,
            endDate: incident.endDate,
            status: incident.status,
            description: incident.description,
            systemUserID: incident.systemUserID,
            lastUpdated: incident.lastUpdated,
            duration: incident.duration,
            vesselVisitExecutionsCodes: incident.vesselVisitExecutions ? incident.vesselVisitExecutions.map(vve => vve.code) : null,
        };

        if (incident.id && incident.id !== "") {
            persistence._id = incident.id;
        }

        return persistence;
    }

    public static toDTO(incident: Incident): IncidentDTO {
        return {
            id: incident.id,
            incidentTypeByCode: incident.incidentType.code,
            startDate: incident.startDate,
            endDate: incident.endDate,
            status: incident.status,
            description: incident.description,
            systemUserID: incident.systemUserID,
            lastUpdated: incident.lastUpdated,
            duration: incident.duration,
            vesselVisitExecutionsCodes: incident.vesselVisitExecutions ? incident.vesselVisitExecutions.map(vve => vve.code) : [],
        };
    }
}