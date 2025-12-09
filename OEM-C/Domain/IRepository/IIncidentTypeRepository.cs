namespace Domain.IRepository;

using Domain.Model;

public interface IIncidentTypeRepository : IGenericRepository<IncidentType>
{
    Task<IEnumerable<IncidentType>> GetAllIncidentTypes();
    Task<IncidentType?> GetIncidentTypeByIdAsync(long id);
    Task<IncidentType?> GetIncidentTypeByCodeAsync(string code);
    Task<IncidentType?> GetIncidentTypeByNameAsync(string name);
    Task<IEnumerable<IncidentType>> GetIncidentTypesWithParentAsync(bool hasParent);
    Task<IEnumerable<IncidentType>> GetIncidentTypesByClassificationAsync(IncidentClassification classification);
    Task<IEnumerable<IncidentType>> GetIncidentTypesByParent(IncidentType parentIncidentType);
    Task<IncidentType> AddIncidentType(IncidentType incidentType);
    Task<bool> Update(IncidentType incidentType, List<string> errorMessages);
}
