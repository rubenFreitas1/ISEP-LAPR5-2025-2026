

namespace Domain.Model;

public class OperationEntry
{
    public long Id { get; set; }

    public string? VesselName { get; private set; }

    public DateTime ArrivalTime { get; private set; }

    public DateTime DepartureTime { get; private set; }

    public List<string>? Cranes { get; private set; }

    public List<string>? StaffMembers { get; private set; }

    public DateTime LastModifiedAt { get; private set; }

    private OperationEntry() { }

    public OperationEntry(string vesselName, DateTime arrivalTime, DateTime departureTime, List<string> cranes, List<string> staffMembers)
    {
        ValidateVesselName(vesselName);
        ValidateCranes(cranes);
        ValidateStaffMembers(staffMembers);
        validateTimes(arrivalTime, departureTime);

        VesselName = vesselName;
        ArrivalTime = arrivalTime;
        DepartureTime = departureTime;
        Cranes = cranes;
        StaffMembers = staffMembers;
        LastModifiedAt = DateTime.UtcNow;
    }

    public void ValidateVesselName(string vesselName)
    {
        if (string.IsNullOrWhiteSpace(vesselName))
        {
            throw new ArgumentException("Vessel name cannot be null or empty.", nameof(vesselName));
        }
    }

    public void ValidateCranes(List<string> cranes)
    {
        if (cranes == null || cranes.Count == 0)
        {
            throw new ArgumentException("Cranes list cannot be null or empty.", nameof(cranes));
        }
    }

    public void ValidateStaffMembers(List<string> staffMembers)
    {
        if (staffMembers == null || staffMembers.Count == 0)
        {
            throw new ArgumentException("Staff members list cannot be null or empty.", nameof(staffMembers));
        }
    }

    public void validateTimes(DateTime arrivalTime, DateTime departureTime)
    {
        if (arrivalTime >= departureTime)
        {
            throw new ArgumentException("Arrival time must be before departure time.");
        }
    }

    public void ChangeName(string newName)
    {
        ValidateVesselName(newName);
        VesselName = newName;
        LastModifiedAt = DateTime.UtcNow;
    }

    public void ChangeCranes(List<string> newCranes)
    {
        ValidateCranes(newCranes);
        Cranes = newCranes;
        LastModifiedAt = DateTime.UtcNow;
    }

    public void ChangeStaffMembers(List<string> newStaffMembers)
    {
        ValidateStaffMembers(newStaffMembers);
        StaffMembers = newStaffMembers;
        LastModifiedAt = DateTime.UtcNow;
    }

    public void ChangeArrivalTime(DateTime newArrivalTime)
    {
        validateTimes(newArrivalTime, DepartureTime);
        ArrivalTime = newArrivalTime;
        LastModifiedAt = DateTime.UtcNow;
    }

    public void ChangeDepartureTime(DateTime newDepartureTime)
    {
        validateTimes(ArrivalTime, newDepartureTime);
        DepartureTime = newDepartureTime;
        LastModifiedAt = DateTime.UtcNow;
    }
}