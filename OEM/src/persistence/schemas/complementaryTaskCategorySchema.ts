import mongoose from "mongoose";
import { IComplementaryTaskCategoryPersistence } from "../../dataschema/IComplementaryTaskCategoryPersistence";

const ComplementaryTaskCategorySchema = new mongoose.Schema(
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
        duration: {
            type: String,
            required: false,
        },
        lastUpdated: {
            type: Date,
            required: false,
        },
        parentComplementaryTaskCategoryId: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model<IComplementaryTaskCategoryPersistence & mongoose.Document>(
    "ComplementaryTaskCategory",
    ComplementaryTaskCategorySchema
);