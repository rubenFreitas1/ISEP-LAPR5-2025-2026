namespace Application.DTO;


public class SchedulingDTO
{
    public List<SchedulingEntryDTO> Entries { get; set; }

    public int TotalDelay { get; set; }

    public SchedulingDTO(List<SchedulingEntryDTO> entries, int totalDelay)
    {
        Entries = entries;
        TotalDelay = totalDelay;
    }

}