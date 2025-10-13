namespace Domain.Factory;

using Domain.Model;

public class VesselRecordFactory : IVesselRecordFactory
{
    public VesselRecord NewVesselRecord(int imoNumber, string name, VesselType vesselType, string operatorName)
    {
        return new VesselRecord(imoNumber, name, vesselType, operatorName);
    }
}