import { IncidentType } from "../domain/IncidentType";
import { IIncidentTypePersistence } from "../dataschema/IIncidentTypePersistence";
import { IncidentTypeDTO } from "../dto/IncidentTypeDTO";

export class IncidentTypeMap {
  
  public static toDomain(raw: IIncidentTypePersistence | any): IncidentType {
    return new IncidentType(
      raw._id ? raw._id.toString() : "",
      raw.code,
      raw.name,
      raw.description,
      raw.classification,
      raw.parentIncidentTypeId
    );
  }

  public static toPersistence(incident: IncidentType): IIncidentTypePersistence {
    const persistence: any = {
      code: incident.code,
      name: incident.name,
      description: incident.description,
      classification: incident.classification,
      parentIncidentTypeId: incident.parentIncidentTypeId,
    };
    
    // Only include _id if it's not empty
    if (incident.id && incident.id !== "") {
      persistence._id = incident.id;
    }
    
    return persistence;
  }

  public static toDTO(
    incident: IncidentType,
    parentIncidentTypeCode?: string
  ): IncidentTypeDTO {
    return {
      id: incident.id,
      code: incident.code,
      name: incident.name,
      description: incident.description,
      classification: incident.classification,
      parentIncidentTypeCode: parentIncidentTypeCode,
    };
  }
}
