using DataModel.Model;
using DataModel.Repository;
using Domain.Model;
using ShippingManagement.Domain.Vessels;

namespace WebApi.IntegrationTests.Helpers;

public static class Utilities
{
    public static void InitializeDbForTests(ShippingManagementContext db)
    {
        db.VesselTypes.AddRange(GetSeedingVesselTypesDataModel());
        db.SaveChanges();
    }

    public static void ReinitializeDbForTests(ShippingManagementContext db)
    {
        db.VesselTypes.RemoveRange(db.VesselTypes);
        InitializeDbForTests(db);
    }

    public static List<VesselTypeDataModel> GetSeedingVesselTypesDataModel()
    {
        return new List<VesselTypeDataModel>()
        {
            new VesselTypeDataModel(new VesselType("Teste1", "DescriptionTeste1", 100, 5,5,5)),
            new VesselTypeDataModel(new VesselType("Teste2", "DescriptionTeste2", 200, 10,10,10)),
            new VesselTypeDataModel(new VesselType("Teste3", "DescriptionTeste3", 300, 15,15,15))
        };
    }
}