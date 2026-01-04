namespace Application.DTO;

public class DockRebalancingDTO
{
    public string Name { get; set; } = string.Empty;
    public int OperationalCapacity { get; set; }
    public List<CraneDTO>? Cranes { get; set; }

    public DockRebalancingDTO() { }

    public DockRebalancingDTO(string name, int operationalCapacity, List<CraneDTO>? cranes = null)
    {
        Name = name;
        OperationalCapacity = operationalCapacity;
        Cranes = cranes;
    }
}

public class CraneDTO
{
    public string Name { get; set; } = string.Empty;
    public int Capacity { get; set; }
}
