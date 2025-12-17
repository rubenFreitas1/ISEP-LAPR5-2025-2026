import { VesselVisitExecutionStatus } from "../domain/VesselVisitExecutionStatus";

export interface IVesselVisitExecutionPersistence {
    _id: string;
    code: string;
    vesselIMO: string;
    status: VesselVisitExecutionStatus;
    arrivalDate: Date;
    lastUpdated: Date;
    systemUserID: string;
}
