using ShippingManagement.Domain.Vessels;

namespace DataModel.Model;

public class VesselTypeDataModel
{
    public long Id { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public int Capacity { get; set; }

    public int MaxRows { get; set; }

    public int MaxBays { get; set; }

    public int MaxTiers { get; set; }

    public VesselTypeDataModel() { }

    public VesselTypeDataModel(VesselType vesselType)
    {
        Id = vesselType.Id;
        Name = vesselType.Name;
        Description = vesselType.Description;
        Capacity = vesselType.Capacity;
        MaxRows = vesselType.MaxRows;
        MaxBays = vesselType.MaxBays;
        MaxTiers = vesselType.MaxTiers;
    }

}