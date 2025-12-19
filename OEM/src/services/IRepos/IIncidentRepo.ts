import { Repo } from "../../core/infra/Repo";
import { Incident } from "../../domain/Incident";
import { IncidentStatus } from "../../domain/IncidentStatus";

export default interface IIncidentRepo extends Repo<Incident> {

    findAll(): Promise<Incident[]>;

    findById(id: string): Promise<Incident | null>;

    findByIDs(ids: string[]): Promise<Incident[]>;

    findByVesselIMO(vesselIMO: string): Promise<Incident[]>;

    findByDateRange(startDate: Date, endDate: Date | null): Promise<Incident[]>;

    findBySeverity(severity: string): Promise<Incident[]>;

    findByStatus(status: IncidentStatus): Promise<Incident[]>;

    update(incident: Incident): Promise<boolean>;
}