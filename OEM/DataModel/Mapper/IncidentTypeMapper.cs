namespace DataModel.Mapper;

using DataModel.Model;
using Domain.Factory;
using Domain.Model;
using Microsoft.EntityFrameworkCore;

public class IncidentTypeMapper
{
   private readonly IIncidentTypeFactory _incidentTypeFactory;

   public IncidentTypeMapper(IIncidentTypeFactory incidentTypeFactory)
   {
       _incidentTypeFactory = incidentTypeFactory;
   }

    public IncidentType ToDomain(IncidentTypeDataModel dataModel)
    {
        IncidentType incidentTypeDomain = _incidentTypeFactory.NewIncidentType(
            dataModel.Code,
            dataModel.Name,
            dataModel.Description,
            dataModel.Classification,
            dataModel.ParentIncidentType != null ? ToDomain(dataModel.ParentIncidentType) : null
        );
        incidentTypeDomain.Id = dataModel.Id;
        if(dataModel.ParentIncidentType != null)
        {
            incidentTypeDomain.ParentIncidentTypeId = dataModel.ParentIncidentType.Id;
        }
        return incidentTypeDomain;
    }

    public IEnumerable<IncidentType> ToDomain(IEnumerable<IncidentTypeDataModel> dataModels)
    {
        List<IncidentType> incidentTypes = new List<IncidentType>();
        foreach (var dataModel in dataModels)
        {
            incidentTypes.Add(ToDomain(dataModel));
        }
        return incidentTypes.AsEnumerable();
    }

    public IncidentTypeDataModel ToDataModel(IncidentType domain)
    {
        IncidentTypeDataModel dataModel = new IncidentTypeDataModel(domain);
        return dataModel;
    }

    public async Task UpdateDataModelAsync(IncidentTypeDataModel dataModel, IncidentType domain, DbContext context)
    {
        dataModel.Code = domain.Code;
        dataModel.Name = domain.Name;
        dataModel.Description = domain.Description;
        dataModel.Classification = domain.Classification;

        if (domain.ParentIncidentType != null)
        {
            var parentDataModel = await context.Set<IncidentTypeDataModel>()
                .FindAsync(domain.ParentIncidentType.Id);
            dataModel.ParentIncidentType = parentDataModel;
            dataModel.ParentIncidentTypeId = domain.ParentIncidentType.Id;
        }
        else
        {
            dataModel.ParentIncidentType = null;
            dataModel.ParentIncidentTypeId = null;
        }
    }

}