using Microsoft.EntityFrameworkCore;

using DataModel.Model;



public interface IOEMContext
{
    DbSet<IncidentTypeDataModel> IncidentTypes { get; set; }
}