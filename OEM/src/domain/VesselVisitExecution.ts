import { VesselVisitExecutionStatus } from "./VesselVisitExecutionStatus";

export class VesselVisitExecution {

    constructor(
        public id: string,
        public code: string,
        public vesselIMO: string,
        public status: VesselVisitExecutionStatus,
        public arrivalDate: Date,
        public lastUpdated: Date,
        public systemUserID: string
    ) {
        this.validateCode(code);
        this.validateVesselIMO(vesselIMO);
        this.validateStatus(status);
        this.validateArrivalDate(arrivalDate);
    }

    private validateCode(code: string) {
        if (!code || code.trim().length === 0) {
            throw new Error("Vessel Visit Execution code cannot be null or empty.");
        }
        const pattern = /^\d{4}-PA-\d{6}$/;
        if (!pattern.test(code)) {
            throw new Error("Vessel Visit Execution code must match pattern 'YYYY-PA-XXXXXX'.");
        }
    }

    private validateVesselIMO(vesselIMO: string) {
        if (!vesselIMO || vesselIMO.trim().length === 0) {
            throw new Error("Vessel IMO cannot be null or empty.");
        }
    }

    private validateStatus(status: VesselVisitExecutionStatus) {
        if (!Object.values(VesselVisitExecutionStatus).includes(status)) {
            throw new Error("Invalid Vessel Visit Execution status.");
        }
    }

    private validateArrivalDate(arrivalDate: Date) {
        if (!(arrivalDate instanceof Date) || isNaN(arrivalDate.getTime())) {
            throw new Error("Arrival date must be a valid date.");
        }
        const now = new Date();
        if (arrivalDate.getTime() > now.getTime()) {
            throw new Error("Arrival date cannot be in the future.");
        }
    }


    updateStatus(status: VesselVisitExecutionStatus) {
        this.validateStatus(status);
        this.status = status;
        this.lastUpdated = new Date();
    }
}