namespace Application.DTO;

using Domain.Model;
using System.Text.Json.Serialization;

public class IncidentTypeDTO
{
    public long Id { get; set; }
    public string Code { get;  set; } = string.Empty;
    public string Name { get;  set; }  = string.Empty;
    public string Description { get;  set; } = string.Empty;

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public IncidentClassification Classification { get; set; }
    public string? ParentIncidentTypeCode { get; set; }

    public IncidentTypeDTO(){}

    public IncidentTypeDTO(long id, string code, string name, string description, IncidentClassification classification, string? parentIncidentTypeCode = null)
    {
        Id = id;
        Code = code;
        Name = name;
        Description = description;
        Classification = classification;
        ParentIncidentTypeCode = parentIncidentTypeCode;
    }

    static public IncidentTypeDTO ToDTO(IncidentType incidentType)
    {
         try
        {
            IncidentTypeDTO incidentTypeDTO = new IncidentTypeDTO(incidentType.Id, incidentType.Code, incidentType.Name, incidentType.Description, incidentType.Classification, incidentType.ParentIncidentType != null ? incidentType.ParentIncidentType.Code : null);
            return incidentTypeDTO;
        }
        catch (ArgumentOutOfRangeException ex)
        {
            throw new ArgumentException($"Error converting to StorageAreaDTO: {ex.Message}");
        }
    }

    static public IEnumerable<IncidentTypeDTO> ToDTO(IEnumerable<IncidentType> incidentTypes)
    {
        List<IncidentTypeDTO> incidentTypeDTOs = new List<IncidentTypeDTO>();
        foreach (IncidentType incidentType in incidentTypes)
        {
            IncidentTypeDTO incidentTypeDTO = ToDTO(incidentType);
            incidentTypeDTOs.Add(incidentTypeDTO);
        }
        return incidentTypeDTOs;
    }
}