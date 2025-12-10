import mongoose from "mongoose";
import { IIncidentTypePersistence } from "../../dataschema/IIncidentTypePersistence";

const IncidentTypeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      maxlength: 10,
    },

    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    classification: {
      type: String,
      enum: ["Minor", "Major", "Critical"],
      required: true,
    },

    parentIncidentTypeId: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IIncidentTypePersistence & mongoose.Document>(
  "IncidentType",
  IncidentTypeSchema
);
