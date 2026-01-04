import { VesselVisitExecution } from "../domain/VesselVisitExecution";
import { IVesselVisitExecutionPersistence } from "../dataschema/IVesselVisitExecutionPersistence";
import { VesselVisitExecutionDTO } from "../dto/VesselVisitExecutionDTO";
import { OperationExecutionEntryMap } from "./OperationExecutionEntryMap";

export class VesselVisitExecutionMap {

    public static toDomain(raw: IVesselVisitExecutionPersistence | any): VesselVisitExecution {
        const operations = raw.operations && Array.isArray(raw.operations)
            ? raw.operations.map((op: any) => OperationExecutionEntryMap.toDomain(op))
            : [];

        return new VesselVisitExecution(
            raw._id ? raw._id.toString() : "",
            raw.code,
            raw.vesselIMO,
            raw.status,
            raw.arrivalDate,
            raw.lastUpdated,
            raw.systemUserID,
            operations,
            raw.DockAssigned || "",
            raw.departureDate,
            raw.vvnCode,
            raw.plannedDock,
            raw.originalArrivalDate,
            raw.warning
        );
    }

    public static toPersistence(vve: VesselVisitExecution): IVesselVisitExecutionPersistence {
        const persistence: any = {
            code: vve.code,
            vesselIMO: vve.vesselIMO,
            status: vve.status,
            arrivalDate: vve.arrivalDate,
            originalArrivalDate: vve.originalArrivalDate,
            departureDate: vve.departureDate,
            lastUpdated: vve.lastUpdated,
            systemUserID: vve.systemUserID,
            DockAssigned: vve.DockAssigned,
            operations: vve.operations.map(op => OperationExecutionEntryMap.toPersistence(op)),
            vvnCode: vve.vvnCode,
            plannedDock: vve.plannedDock,
            warning: vve.warning
        };

        if (vve.id && vve.id !== "") {
            persistence._id = vve.id;
        }
        return persistence;
    }

    public static toDTO(vve: VesselVisitExecution): VesselVisitExecutionDTO {
        // DockAssigned comes directly from the database - no inference
        const dockAssigned = vve.DockAssigned || "";
        
        console.log(`🔍 VVE ${vve.code} - DockAssigned: "${dockAssigned}", plannedDock: "${vve.plannedDock}"`);

        // Infer status from operations if status is InProgress
        let status = vve.status;
        if (status === 'InProgress' && vve.operations && vve.operations.length > 0) {
            const firstOp = vve.operations[0];
            if (firstOp && firstOp.operationType) {
                const opType = firstOp.operationType.toUpperCase();
                
                if (opType.includes('UNLOAD')) {
                    status = 'Unloading' as any;
                    console.log(`📦 Inferred status: Unloading (from operation type: ${firstOp.operationType})`);
                } else if (opType.includes('LOAD')) {
                    status = 'Loading' as any;
                    console.log(`📦 Inferred status: Loading (from operation type: ${firstOp.operationType})`);
                }
            }
        }

        // Get warning from domain model if present
        const warning = vve.warning || undefined;
        if (warning) {
            console.log(`⚠️ Warning to return: ${warning}`);
        }

        return {
            id: vve.id,
            code: vve.code,
            vesselIMO: vve.vesselIMO,
            vesselVisitNotificationCode: vve.vvnCode,
            status: status,
            arrivalDate: vve.arrivalDate,
            originalArrivalDate: vve.originalArrivalDate,
            departureDate: vve.departureDate,
            lastUpdated: vve.lastUpdated,
            systemUserID: vve.systemUserID,
            plannedDock: vve.plannedDock,
            DockAssigned: dockAssigned,
            operations: vve.operations.map(op => OperationExecutionEntryMap.toDTO(op)),
            warning: warning
        };
    }
}