import { IncidentClassification } from "./IncidentQualification";

export class IncidentType {

  constructor(
    public id: string,
    public code: string,
    public name: string,
    public description: string,
    public classification: IncidentClassification,
    public parentIncidentTypeId?: string
  ) {
    this.validateName(name);
    this.validateCode(code);
    this.validateDescription(description);
    
  }

  private validateName(name: string) {
    if (!name || name.trim().length === 0) {
      throw new Error("Incident type name cannot be null or empty.");
    }
  }

  private validateCode(code: string) {
    if (!code || code.trim().length === 0) {
      throw new Error("Incident type code cannot be null or empty.");
    }
    if (code.length > 10) {
      throw new Error("Incident type code cannot exceed 10 characters.");
    }
  }

  private validateDescription(description: string) {
    if (!description || description.trim().length === 0) {
      throw new Error("Incident type description cannot be null or empty.");
    }
  }

  updateName(name: string) {
    this.validateName(name);
    this.name = name;
  }

  updateDescription(description: string) {
    this.validateDescription(description);
    this.description = description;
  }

  updateClassification(classification: IncidentClassification) {
    this.classification = classification;
  }

  updateParentIncidentType(id?: string) {
    this.parentIncidentTypeId = id;
  }
}
