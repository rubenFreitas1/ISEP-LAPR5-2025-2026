namespace DataModel.Repository;

using Microsoft.EntityFrameworkCore;

using DataModel.Model;

public interface IShippingManagementContext
{
    DbSet<VesselTypeDataModel> VesselTypes { get; set; }
}