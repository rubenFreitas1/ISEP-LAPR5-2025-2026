namespace Application.DTO;


public class DataScheduleDTO
{
    public List<VesselVisitNotificationDTO> VesselVisitNotifications { get; set; }
    public PhysicalResourceDTO AssignedCrane { get; set; }
    public int MaxCranes { get; set; }
    public List<DockRebalancingDTO>? Docks { get; set; }

    public DataScheduleDTO(List<VesselVisitNotificationDTO> vesselVisitNotifications, PhysicalResourceDTO assignedCrane, int maxCranes, List<DockRebalancingDTO>? docks = null)
    {
        VesselVisitNotifications = vesselVisitNotifications;
        AssignedCrane = assignedCrane;
        MaxCranes = maxCranes;
        Docks = docks;
    }
}