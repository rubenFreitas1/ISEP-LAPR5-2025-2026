import mongoose from "mongoose";
import { IIncidentPersistence } from "../../dataschema/IIncidentPersistence";

const IncidentSchema = new mongoose.Schema(
  {
    incidentTypeCode: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: false
    },
    status: {
      type: String,
      required: true,
      enum: ["Active", "Resolved"]
    },
    description: {
      type: String,
      required: true
    },
    systemUserID: {
      type: String,
      required: false
    },
    lastUpdated: {
      type: Date,
      required: false,
      unique: false
    },
    duration: {
      type: Number,
      required: false,
    },
    vesselVisitExecutionsCodes: [{
      type: String,
      required: false  
    }]
  },
    { timestamps: true }
);

export default mongoose.model<IIncidentPersistence & mongoose.Document>(
  "Incident",
  IncidentSchema
);