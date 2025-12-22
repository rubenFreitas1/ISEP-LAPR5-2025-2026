import { Service, Inject } from 'typedi';
import IComplementaryTaskCategoryRepo from '../services/IRepos/IComplementaryTaskCategoryRepo';
import { ComplementaryTaskCategory } from '../domain/ComplementaryTaskCategory';
import { Document, Model } from 'mongoose';
import { IComplementaryTaskCategoryPersistence } from '../dataschema/IComplementaryTaskCategoryPersistence';
import { ComplementaryTaskCategoryMap } from "../mappers/ComplementaryTaskCategoryMap";



@Service()
export default class ComplementaryTaskCategoryRepo implements IComplementaryTaskCategoryRepo {

    constructor(
        @Inject('complementaryTaskCategorySchema') private complementaryTaskCategorySchema: Model<IComplementaryTaskCategoryPersistence & Document>,  
    ){}

    async exists(type: ComplementaryTaskCategory): Promise<boolean> {
    const record = await this.complementaryTaskCategorySchema.findOne({ code: type.code });
    return !!record;
  }

  async save(type: ComplementaryTaskCategory): Promise<ComplementaryTaskCategory> {
    const existing = await this.complementaryTaskCategorySchema.findOne({ code: type.code });

    const raw = ComplementaryTaskCategoryMap.toPersistence(type);

    if (!existing) {
      const created = await this.complementaryTaskCategorySchema.create(raw);
      return ComplementaryTaskCategoryMap.toDomain(created);
    } else {
      return null;
    }
  }

  async findByIds(ids: string[]): Promise<ComplementaryTaskCategory[]> {
    const models = await this.complementaryTaskCategorySchema.find({ _id: { $in: ids } });
    return models.map(m => ComplementaryTaskCategoryMap.toDomain(m));
  }

  async findAll(): Promise<ComplementaryTaskCategory[]> {
    const records = await this.complementaryTaskCategorySchema.find();
    return records.map(record => ComplementaryTaskCategoryMap.toDomain(record));
  }

  async findById(id: string): Promise<ComplementaryTaskCategory | null> {
    const record = await this.complementaryTaskCategorySchema.findById(id);
    return record ? ComplementaryTaskCategoryMap.toDomain(record) : null;
  }

  async findByCode(code: string): Promise<ComplementaryTaskCategory | null> {
    const record = await this.complementaryTaskCategorySchema.findOne({ code });
    return record ? ComplementaryTaskCategoryMap.toDomain(record) : null;
  }

  async findByName(name: string): Promise<ComplementaryTaskCategory | null> {
    const record = await this.complementaryTaskCategorySchema.findOne({ name });
    return record ? ComplementaryTaskCategoryMap.toDomain(record) : null;
  }

  async findWithParent(hasParent: boolean): Promise<ComplementaryTaskCategory[]> {
    const filter = hasParent
      ? { parentComplementaryTaskCategoryId: { $ne: null } }
      : { parentComplementaryTaskCategoryId: null };

    const records = await this.complementaryTaskCategorySchema.find(filter);
    return records.map(r => ComplementaryTaskCategoryMap.toDomain(r));
  }

  async findByParent(parentId: string): Promise<ComplementaryTaskCategory[]> {
    const records = await this.complementaryTaskCategorySchema.find({
      parentComplementaryTaskCategoryId: parentId,
    });
    return records.map(r => ComplementaryTaskCategoryMap.toDomain(r));
  }

  async update(type: ComplementaryTaskCategory): Promise<boolean> {
    const raw = ComplementaryTaskCategoryMap.toPersistence(type);
    const result = await this.complementaryTaskCategorySchema.updateOne(
      { code: type.code },
      raw
    );
    return result.modifiedCount > 0;
  }
}