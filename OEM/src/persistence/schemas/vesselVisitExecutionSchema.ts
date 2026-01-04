import mongoose from "mongoose";
import { IVesselVisitExecutionPersistence } from "../../dataschema/IVesselVisitExecutionPersistence";
import { VesselVisitExecution } from "../../domain/VesselVisitExecution";
import { VesselVisitExecutionStatus } from "../../domain/VesselVisitExecutionStatus";

const VesselVisitExecutionSchema = new mongoose.Schema(
  {
    code: {
        type: String,
        required: false,
        unique: true
    },

    vesselIMO: {
        type: String,
        required: false,
        unique: true
    },

    vvnCode: {
        type: String,
        required: false,
        unique: false
    },

    status: {
      type: String,
      enum: Object.values(VesselVisitExecutionStatus),
      required: false,
      unique: false
    },

    arrivalDate: {
        type: Date,
        required: true,
        unique: false
    },

    originalArrivalDate: {
        type: Date,
        required: false,
        unique: false
    },

    departureDate: {
      type: Date,
      required: false,
      unique: false
    },

    lastUpdated: {
        type: Date,
        required: false,
        unique: false
    },

    systemUserID: {
        type: String,
        required: true
    },

    DockAssigned: {
        type: String,
        required: false,
        default: ""
    },

    plannedDock: {
        type: String,
        required: false,
        default: ""
    },

    warning: {
        type: String,
        required: false
    },

    operations: {
        type: [
            {
                id: { type: String, required: true },
                operationType: { type: String, required: true },
                container: { type: String, required: true },
                plannedStart: { type: Date, required: true },
                plannedEnd: { type: Date, required: true },
                craneUsed: { type: String, required: true },
                status: { 
                    type: String, 
                    enum: ["Pending", "Started", "Completed", "Delayed"],
                    required: true 
                },
                actualStart: { type: Date, required: false },
                actualEnd: { type: Date, required: false }
            }
        ],
        default: []
    }
  },
  { timestamps: true }
);

export default mongoose.model<IVesselVisitExecutionPersistence & mongoose.Document>(
  "VesselVisitExecution",
  VesselVisitExecutionSchema
);
