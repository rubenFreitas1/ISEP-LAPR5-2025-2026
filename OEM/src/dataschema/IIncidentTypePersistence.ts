import { IncidentClassification } from "../domain/IncidentQualification";

export interface IIncidentTypePersistence {
  _id: string; 
  code: string;
  name: string;
  description: string;
  classification: IncidentClassification;
  parentIncidentTypeId?: string; 
}
