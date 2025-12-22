import { ComplementaryTaskCategory } from "../domain/ComplementaryTaskCategory";
import { IComplementaryTaskCategoryPersistence } from "../dataschema/IComplementaryTaskCategoryPersistence";
import { ComplementaryTaskCategoryDTO } from "../dto/ComplementaryTaskCategoryDTO";

export class ComplementaryTaskCategoryMap {
  
  public static toDomain(raw: IComplementaryTaskCategoryPersistence | any): ComplementaryTaskCategory {
    return new ComplementaryTaskCategory(
      raw._id ? raw._id.toString() : "",
      raw.code,
      raw.name,
      raw.description,
      raw.duration,
      raw.lastUpdated,
      raw.parentComplementaryTaskCategoryId
    );
  }

  public static toPersistence(incident: ComplementaryTaskCategory): IComplementaryTaskCategoryPersistence {
    const persistence: any = {
      code: incident.code,
      name: incident.name,
      description: incident.description,
      duration: incident.duration,
      lastUpdated: incident.lastUpdated,
      parentComplementaryTaskCategoryId: incident.parentComplementaryTaskCategoryId,
    };
    
    // Only include _id if it's not empty
    if (incident.id && incident.id !== "") {
      persistence._id = incident.id;
    }
    
    return persistence;
  }

  public static toDTO(
    incident: ComplementaryTaskCategory,
    parentComplementaryTaskCategoryCode?: string
  ): ComplementaryTaskCategoryDTO {
    return {
      id: incident.id,
      code: incident.code,
      name: incident.name,
      description: incident.description,
      duration: incident.duration,
      lastUpdated: incident.lastUpdated,
      parentComplementaryTaskCategoryCode: parentComplementaryTaskCategoryCode,
    };
  }
}
