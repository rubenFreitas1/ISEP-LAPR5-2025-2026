namespace Domain.Factory;

using Domain.Model;
using ShippingManagement.Domain.Vessels;

public interface IVesselRecordFactory
{
    VesselRecord NewVesselRecord(int imoNumber, string name, VesselType vesselType, string operatorName);
}