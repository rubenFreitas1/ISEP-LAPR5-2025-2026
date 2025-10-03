namespace Domain.Factory;

using Domain.Model;
using ShippingManagement.Domain.Vessels;

public interface IVesselTypeFactory
{
    VesselType NewVesselType(string name, string description, int capacity, int maxRows, int maxBays, int maxTiers);
}