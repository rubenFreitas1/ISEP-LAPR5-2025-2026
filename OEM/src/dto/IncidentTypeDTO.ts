import { IncidentClassification } from "../domain/IncidentQualification";

export interface IncidentTypeDTO {
  id: string;
  code: string;
  name: string;
  description: string;
  classification: IncidentClassification;
  parentIncidentTypeCode?: string;
}