import { Result } from "../../core/logic/Result";
import { ComplementaryTaskCategoryDTO } from "../../dto/ComplementaryTaskCategoryDTO";

export default interface IComplementaryTaskCategoryService {

  getAllComplementaryTaskCategories(): Promise<Result<ComplementaryTaskCategoryDTO[]>>;
  getComplementaryTaskCategoryById(id: string): Promise<Result<ComplementaryTaskCategoryDTO>>;

  getComplementaryTaskCategoryByCode(code: string): Promise<Result<ComplementaryTaskCategoryDTO>>;

  getComplementaryTaskCategoryByName(name: string): Promise<Result<ComplementaryTaskCategoryDTO>>;

  getComplementaryTaskCategoriesWithParent(hasParent: boolean): Promise<Result<ComplementaryTaskCategoryDTO[]>>;

  getComplementaryTaskCategoryByParent(parentId: string): Promise<Result<ComplementaryTaskCategoryDTO[]>>;

  create(dto: ComplementaryTaskCategoryDTO): Promise<Result<ComplementaryTaskCategoryDTO>>;

  update(code: string, dto: ComplementaryTaskCategoryDTO): Promise<Result<ComplementaryTaskCategoryDTO>>;
}