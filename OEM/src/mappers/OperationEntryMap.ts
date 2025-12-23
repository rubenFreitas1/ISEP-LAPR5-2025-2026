import { OperationEntry } from "../domain/OperationEntry";
import { IOperationEntryPersistence } from "../dataschema/IOperationEntryPersistence";
import { OperationEntryDTO } from "../dto/OperationEntryDTO";

export class OperationEntryMap {

    public static toDomain(raw: IOperationEntryPersistence | any): OperationEntry {
        return new OperationEntry(
            raw.id || raw._id?.toString() || "",
            raw.operationType,
            raw.container,
            raw.operationStart,
            raw.operationEnd,
            raw.craneUsed
        );
    }

    public static toPersistence(entry: OperationEntry): IOperationEntryPersistence {
        const persistence: any = {
            id: entry.id,
            operationType: entry.operationType,
            container: entry.container,
            operationStart: entry.operationStart,
            operationEnd: entry.operationEnd,
            craneUsed: entry.craneUsed
        };

        return persistence;
    }

    public static toDTO(entry: OperationEntry): OperationEntryDTO {
        return {
            id: entry.id,
            operationType: entry.operationType,
            container: entry.container,
            operationStart: entry.operationStart,
            operationEnd: entry.operationEnd,
            craneUsed: entry.craneUsed
        };
    }

}