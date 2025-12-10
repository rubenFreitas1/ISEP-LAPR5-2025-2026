import { Result } from "../../core/logic/Result";
import { IncidentTypeDTO } from "../../dto/IncidentTypeDTO";

export default interface IIncidentTypeService {

  getAllIncidentTypes(): Promise<Result<IncidentTypeDTO[]>>;

  getIncidentTypeById(id: string): Promise<Result<IncidentTypeDTO>>;

  getIncidentTypeByCode(code: string): Promise<Result<IncidentTypeDTO>>;

  getIncidentTypeByName(name: string): Promise<Result<IncidentTypeDTO>>;

  getIncidentTypesWithParent(hasParent: boolean): Promise<Result<IncidentTypeDTO[]>>;

  getIncidentTypesByClassification(classification: string): Promise<Result<IncidentTypeDTO[]>>;

  getIncidentTypesByParent(parentId: string): Promise<Result<IncidentTypeDTO[]>>;

  create(dto: IncidentTypeDTO): Promise<Result<IncidentTypeDTO>>;

  update(code: string, dto: IncidentTypeDTO): Promise<Result<IncidentTypeDTO>>;
}
