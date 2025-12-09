namespace Application.DTO;

using Domain.Model;

public class OperationEntryDTO
{
    public string? VesselName { get; set; }
    public DateTime ArrivalTime { get; set; }
    public DateTime DepartureTime { get; set; }
    public List<string>? Cranes { get; set; }
    public List<string>? StaffMembers { get; set; }

    public DateTime LastModifiedAt { get; set; }

    public OperationEntryDTO() { }

    public OperationEntryDTO(string vesselName, DateTime arrivalTime, DateTime departureTime, List<string> cranes, List<string> staffMembers)
    {
        VesselName = vesselName;
        ArrivalTime = arrivalTime;
        DepartureTime = departureTime;
        Cranes = cranes;
        StaffMembers = staffMembers;
    }
    

    static public OperationEntryDTO ToDTO(OperationEntry entry)
    {
        try
        {
            OperationEntryDTO dto = new OperationEntryDTO(
                entry.VesselName!,
                entry.ArrivalTime,
                entry.DepartureTime,
                entry.Cranes!,
                entry.StaffMembers!
            );
            dto.LastModifiedAt = entry.LastModifiedAt;
            return dto;
        }
        catch (ArgumentOutOfRangeException ex)
        {
            throw new ArgumentException($"Error converting to OperationEntryDTO: {ex.Message}");
        }
    }

    static public IEnumerable<OperationEntryDTO> ToDTO(IEnumerable<OperationEntry> entries)
    {
        List<OperationEntryDTO> dtos = new List<OperationEntryDTO>();
        foreach (OperationEntry entry in entries)
        {
            OperationEntryDTO dto = ToDTO(entry);
            dtos.Add(dto);
        }
        return dtos;
    }

    static public OperationEntry ToDomain(OperationEntryDTO dto)
    {
        if (dto.VesselName is null)
            throw new InvalidOperationException("OperationEntry.VesselName cannot be null");
        OperationEntry entry = new OperationEntry(dto.VesselName, dto.ArrivalTime, dto.DepartureTime, dto.Cranes!, dto.StaffMembers!);
        return entry;
    }

    public OperationEntry UpdateDomain(OperationEntry entry, OperationEntryDTO dto)
    {
        entry.ChangeName(dto.VesselName!);
        entry.ChangeCranes(dto.Cranes!);
        entry.ChangeStaffMembers(dto.StaffMembers!);
        entry.ChangeArrivalTime(dto.ArrivalTime);
        entry.ChangeDepartureTime(dto.DepartureTime);
        return entry;
    }
}