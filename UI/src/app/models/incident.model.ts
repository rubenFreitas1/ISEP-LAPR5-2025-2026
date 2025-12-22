export interface IncidentModel {
  id?: string;
  description?: string;
  startDate?: string | Date;
  endDate?: string | Date | null;
  duration?: number | null;
  severity?: string;
  status?: string;
  classification?: string;
  vesselVisitExecutionsCodes?: string[] | null;
  incidentTypeCode?: string;
  systemUserID?: string;
  lastUpdated?: string | Date;
}
