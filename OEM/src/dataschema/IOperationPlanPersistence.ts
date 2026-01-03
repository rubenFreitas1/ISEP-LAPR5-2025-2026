import { IOperationEntryPersistence } from "./IOperationEntryPersistence";

export interface IChangeLogEntryPersistence {
  date: Date;
  author: string;
  reason: string;
  changes: string;
}

export interface IOperationPlanPersistence {
  _id: string;
  vvn: string;
  TargetDay: Date;
  arrivalTime: Date;
  departureTime: Date;
  operations: IOperationEntryPersistence[];
  author: string;
  algorithm: string;
  createdAt: Date;
  changeLog?: IChangeLogEntryPersistence[];
}
