import { OperationPlan } from "../domain/OperationPlan";
import { IOperationPlanPersistence } from "../dataschema/IOperationPlanPersistence";
import { OperationPlanDTO } from "../dto/OperationPlanDTO";
import { OperationEntryMap } from "./OperationEntryMap";

export class OperationPlanMap {

  public static toDomain(
    raw: IOperationPlanPersistence | any
  ): OperationPlan {
    return new OperationPlan(
      raw._id ? raw._id.toString() : "",
      raw.vvn,
      raw.TargetDay,
      raw.arrivalTime,
      raw.departureTime,
      raw.operations
        ? raw.operations.map((op: any) =>
            OperationEntryMap.toDomain(op)
          )
        : [],
      raw.author,
      raw.algorithm,
      raw.createdAt
    );
  }

  public static toPersistence(
    plan: OperationPlan
  ): IOperationPlanPersistence {

    const persistence: any = {
      vvn: plan.vvn,
      TargetDay: plan.TargetDay,
      arrivalTime: plan.arrivalTime,
      departureTime: plan.departureTime,
      operations: plan.operations.map(op =>
        OperationEntryMap.toPersistence(op)
      ),
      author: plan.author,
      algorithm: plan.algorithm,
      createdAt: plan.createdAt
    };

    if (plan.id && plan.id !== "") {
      persistence._id = plan.id;
    }

    return persistence;
  }

  public static toDTO(plan: OperationPlan): OperationPlanDTO {
    return {
      id: plan.id,
      vvn: plan.vvn,
      targetDay: plan.TargetDay,
      arrivalTime: plan.arrivalTime,
      departureTime: plan.departureTime,
      operations: plan.operations.map(op =>
        OperationEntryMap.toDTO(op)
      ),
      author: plan.author,
      algorithm: plan.algorithm,
      createdAt: plan.createdAt
    };
  }
}
