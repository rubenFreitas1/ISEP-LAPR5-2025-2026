namespace DataModel.Model;

using Domain.Model;

public class IncidentTypeDataModel
{
    public long Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public IncidentClassification Classification { get; set; }
    
    public long? ParentIncidentTypeId { get; set; }
    public IncidentTypeDataModel? ParentIncidentType { get; set; }

    public IncidentTypeDataModel() { }

    public IncidentTypeDataModel(IncidentType incidentType)
    {
        Id = incidentType.Id;
        Code = incidentType.Code;
        Name = incidentType.Name;
        Description = incidentType.Description;
        Classification = incidentType.Classification;
        ParentIncidentTypeId = incidentType.ParentIncidentTypeId;
    }
    
}