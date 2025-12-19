import { IncidentStatus } from "./IncidentStatus";
import { IncidentType } from "./IncidentType";
import { VesselVisitExecution } from "./VesselVisitExecution";

export class Incident {

    constructor(
        public id: string,
        public incidentType: IncidentType,
        public startDate: Date,
        public endDate: Date | null,
        public status: IncidentStatus,
        public description: string,
        public systemUserID: string,
        public lastUpdated: Date,
        public duration: number | null,
        public vesselVisitExecutions: VesselVisitExecution[] | null,
    ) {
        this.validateStartDate(startDate);
        this.validateEndDate(endDate);
        this.validateStatus(status);
        this.validateDescription(description);
        this.validateDuration(duration);
    }

    private validateStartDate(startDate: Date) {
        if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
            throw new Error("Start date must be a valid date.");
        }
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (startDate.getTime() < oneWeekAgo.getTime()) {
            throw new Error("Start date cannot be more than one week before today.");
        }
    }

    private validateEndDate(endDate: Date | null) {
        if (endDate !== null) {
            if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
                throw new Error("End date must be a valid date or null.");
            }
            if (endDate.getTime() < this.startDate.getTime()) {
                throw new Error("End date cannot be earlier than start date.");
            }
        }
    }

    private validateStatus(status: IncidentStatus) {
        if (!Object.values(IncidentStatus).includes(status)) {
            throw new Error("Invalid incident status.");
        }
    }

    private validateDescription(description: string) {
        if (!description || description.trim().length === 0) {
            throw new Error("Incident description cannot be null or empty.");
        }
        const words = description.trim().split(/\s+/);
        if (words.length < 2) {
            throw new Error("Incident description must contain at least two words.");
        }
    }

    private validateDuration(duration: number | null) {
        if (duration === null || duration === undefined) return;
        if (typeof duration !== "number" || isNaN(duration) || duration < 0) {
            throw new Error("Incident duration must be a non-negative number or null.");
        }
    }

    updateEndDate(endDate: Date) {
        this.validateEndDate(endDate);
        this.endDate = endDate;
        this.lastUpdated = new Date();
    }

    updateStatus(status: IncidentStatus) {
        this.validateStatus(status);
        this.status = status;
        this.lastUpdated = new Date();
    }

    updateDescription(description: string) {
        this.validateDescription(description);
        this.description = description;
        this.lastUpdated = new Date();
    }

    updateDuration(duration: number | null) {
        this.validateDuration(duration);
        this.duration = duration;
        this.lastUpdated = new Date();
    }

    updateVesselVisitExecutions(vve: VesselVisitExecution[]) {
        this.vesselVisitExecutions = vve;
        this.lastUpdated = new Date();
    }
}