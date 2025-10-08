namespace Domain.IRepository;

using ShippingManagement.Domain.Vessels;

public interface IVesselRecordRepository : IGenericRepository<VesselRecord>
{
    Task<IEnumerable<VesselRecord>> GetVesselRecordsAsync();

    Task<VesselRecord?> GetVesselRecordByIdAsync(long id);

    Task<VesselRecord?> GetVesselRecordByNameAsync(string name);

    Task<VesselRecord?> GetVesselRecordByImoNumberAsync(int imoNumber);

    Task<VesselRecord?> GetVesselRecordByOperatorAsync(string operatorName);

    Task<VesselRecord> AddVesselRecord(VesselRecord vesselRecord);

    Task<VesselRecord?> Update(VesselRecord vesselRecord, List<string> errorMessages);

    Task<bool> VesselRecordExists(long id);
}