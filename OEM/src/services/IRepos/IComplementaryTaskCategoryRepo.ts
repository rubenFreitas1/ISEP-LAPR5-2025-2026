import { Repo } from "../../core/infra/Repo";
import { ComplementaryTaskCategory } from "../../domain/ComplementaryTaskCategory";

export default interface IComplementaryTaskCategoryRepo extends Repo<ComplementaryTaskCategory> {
  
  findAll(): Promise<ComplementaryTaskCategory[]>;

  findById(id: string): Promise<ComplementaryTaskCategory | null>;

  findByCode(code: string): Promise<ComplementaryTaskCategory | null>;

  findByName(name: string): Promise<ComplementaryTaskCategory | null>;

  findWithParent(hasParent: boolean): Promise<ComplementaryTaskCategory[]>;

  findByParent(parentId: string): Promise<ComplementaryTaskCategory[]>;

  update(incidentType: ComplementaryTaskCategory): Promise<boolean>;

  findByIds(ids: string[]): Promise<ComplementaryTaskCategory[]>;
}
