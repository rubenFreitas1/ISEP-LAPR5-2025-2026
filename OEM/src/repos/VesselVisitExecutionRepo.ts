import { Service, Inject } from 'typedi';
import IVesselVisitExecutionRepo from '../services/IRepos/IVesselVisitExecutionRepo';
import { VesselVisitExecution } from '../domain/VesselVisitExecution';
import { Document, Model } from 'mongoose';
import { IVesselVisitExecutionPersistence } from '../dataschema/IVesselVisitExecutionPersistence';
import { VesselVisitExecutionMap } from "../mappers/VesselVisitExecutionMap";
import { VesselVisitExecutionStatus } from '../domain/VesselVisitExecutionStatus';

@Service()
export default class VesselVisitExecutionRepo implements IVesselVisitExecutionRepo {

    constructor(
        @Inject('vesselVisitExecutionSchema') private vesselVisitExecutionSchema: Model<IVesselVisitExecutionPersistence & Document>,  
    ){}

    async exists(vve: VesselVisitExecution): Promise<boolean> {
        const record = await this.vesselVisitExecutionSchema.findOne({ code: vve.code });
        return !!record;
    }

    async save(vve: VesselVisitExecution): Promise<VesselVisitExecution> {
        const existing = await this.vesselVisitExecutionSchema.findOne({ code: vve.code });
        const raw = VesselVisitExecutionMap.toPersistence(vve);

        if (!existing) {
            const created = await this.vesselVisitExecutionSchema.create(raw);
            return VesselVisitExecutionMap.toDomain(created);
        } else {
            return null;
        }
    }

    async findAll(): Promise<VesselVisitExecution[]> {
        const records = await this.vesselVisitExecutionSchema.find();
        return records.map(record => VesselVisitExecutionMap.toDomain(record));
    }

    async findById(id: string): Promise<VesselVisitExecution | null> {
        const record = await this.vesselVisitExecutionSchema.findById(id);
        return record ? VesselVisitExecutionMap.toDomain(record) : null;
    }

    async findByCode(code: string): Promise<VesselVisitExecution | null> {
        const record = await this.vesselVisitExecutionSchema.findOne({ code });
        return record ? VesselVisitExecutionMap.toDomain(record) : null;
    }
    
    async findByStatus(status: VesselVisitExecutionStatus): Promise<VesselVisitExecution[]> {
        const records = await this.vesselVisitExecutionSchema.find({ status });
        return records.map(record => VesselVisitExecutionMap.toDomain(record));
    }

    async findByVesselIMO(vesselIMO: string): Promise<VesselVisitExecution | null> {
        const record = await this.vesselVisitExecutionSchema.findOne({ vesselIMO });
        return record ? VesselVisitExecutionMap.toDomain(record) : null;
        
    }
    
    async update(vve: VesselVisitExecution): Promise<boolean> {
        const raw = VesselVisitExecutionMap.toPersistence(vve);
        const result = await this.vesselVisitExecutionSchema.updateOne({ code: vve.code }, raw);
        return result.modifiedCount > 0;
    }
}