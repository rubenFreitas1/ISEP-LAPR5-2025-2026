namespace DataModel.Repository;

using DataModel.Mapper;
using DataModel.Model;
using Domain.IRepository;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Domain.Model;
using System.Collections.Generic;
public class IncidentTypeRepository : GenericRepository<IncidentType>, IIncidentTypeRepository
{
    private readonly IncidentTypeMapper _mapper;
    public IncidentTypeRepository(OEMContext context, IncidentTypeMapper mapper) : base(context!)
    {
        _mapper = mapper;
    }

    public async Task<IEnumerable<IncidentType>> GetAllIncidentTypes()
    {
        try
        {
            IEnumerable<IncidentTypeDataModel> dataModels = await _context.Set<IncidentTypeDataModel>()
                .Include(it => it.ParentIncidentType)
                .ToListAsync();
            IEnumerable<IncidentType> incidentTypes = _mapper.ToDomain(dataModels);
            return incidentTypes;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<IncidentType?> GetIncidentTypeByIdAsync(long id)
    {
        try
        {
            IncidentTypeDataModel? dataModel = await _context.Set<IncidentTypeDataModel>()
                .Include(it => it.ParentIncidentType)
                .FirstOrDefaultAsync(it => it.Id == id);
            if (dataModel == null)
            {
                return null;
            }
            IncidentType incidentType = _mapper.ToDomain(dataModel);
            return incidentType;
        }catch (Exception)
        {
            throw;
        }
    }

    public async Task<IncidentType?> GetIncidentTypeByCodeAsync(string code)
    {
        try
        {
            IncidentTypeDataModel? dataModel = await _context.Set<IncidentTypeDataModel>()
                .Include(it => it.ParentIncidentType)
                .FirstOrDefaultAsync(it => it.Code == code);
            if (dataModel == null)
            {
                return null;
            }
            IncidentType incidentType = _mapper.ToDomain(dataModel);
            return incidentType;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<IncidentType?> GetIncidentTypeByNameAsync(string name)
    {
        try
        {
            IncidentTypeDataModel? dataModel = await _context.Set<IncidentTypeDataModel>()
                .Include(it => it.ParentIncidentType)
                .FirstOrDefaultAsync(it => it.Name == name);
            if (dataModel == null)
            {
                return null;
            }
            IncidentType incidentType = _mapper.ToDomain(dataModel);
            return incidentType;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<IEnumerable<IncidentType>> GetIncidentTypesWithParentAsync(bool hasParent)
    {
        try
        {
            IQueryable<IncidentTypeDataModel> query = _context.Set<IncidentTypeDataModel>()
                .Include(it => it.ParentIncidentType);
            if (hasParent)
            {
                query = query.Where(it => it.ParentIncidentTypeId != null);
            }
            else
            {
                query = query.Where(it => it.ParentIncidentTypeId == null);
            }

            IEnumerable<IncidentTypeDataModel> dataModels = await query.ToListAsync();
            IEnumerable<IncidentType> incidentTypes = _mapper.ToDomain(dataModels);
            return incidentTypes;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<IEnumerable<IncidentType>> GetIncidentTypesByClassificationAsync(IncidentClassification classification)
    {
        try
        {
            IEnumerable<IncidentTypeDataModel> dataModels = await _context.Set<IncidentTypeDataModel>()
                .Include(it => it.ParentIncidentType)
                .Where(it => it.Classification == classification)
                .ToListAsync();
            IEnumerable<IncidentType> incidentTypes = _mapper.ToDomain(dataModels);
            return incidentTypes;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<IEnumerable<IncidentType>> GetIncidentTypesByParent(IncidentType parentIncidentType)
    {
        try
        {
            IEnumerable<IncidentTypeDataModel> dataModels = await _context.Set<IncidentTypeDataModel>()
                .Include(it => it.ParentIncidentType)
                .Where(it => it.ParentIncidentTypeId == parentIncidentType.Id)
                .ToListAsync();
            IEnumerable<IncidentType> incidentTypes = _mapper.ToDomain(dataModels);
            return incidentTypes;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<IncidentType> AddIncidentType(IncidentType incidentType)
    {
        try
        {
            IncidentTypeDataModel dataModel = _mapper.ToDataModel(incidentType);
            if (dataModel.ParentIncidentType != null)
            {
                var parentDataModel = await _context.Set<IncidentTypeDataModel>()
                    .FindAsync(dataModel.ParentIncidentType.Id);
                if (parentDataModel != null)
                {
                    dataModel.ParentIncidentType = parentDataModel;
                    dataModel.ParentIncidentTypeId = parentDataModel.Id;
                }
            }
            EntityEntry<IncidentTypeDataModel> addedEntity =  _context.Set<IncidentTypeDataModel>().Add(dataModel);
            await _context.SaveChangesAsync();
            IncidentType addedIncidentType = _mapper.ToDomain(addedEntity.Entity);
            return addedIncidentType;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<bool> Update(IncidentType incidentType, List<string> errorMessages)
    {
        try
        {
            IncidentTypeDataModel? dataModel = await _context.Set<IncidentTypeDataModel>()
                .FirstOrDefaultAsync(it => it.Id == incidentType.Id);
            if (dataModel == null)
            {
                errorMessages.Add($"Incident Type with Id '{incidentType.Id}' not found.");
                return false;
            }

            await _mapper.UpdateDataModelAsync(dataModel, incidentType, _context);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            errorMessages.Add("Error updating Incident Type: " + ex.Message);
            return false;
        }
    }
}