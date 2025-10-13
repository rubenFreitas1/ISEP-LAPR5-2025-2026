using System.ComponentModel.DataAnnotations;
using Domain.Model;

namespace DataModel.Model;

public class VesselRecordDataModel
{

    public long Id { get; set; }

    [Required]
    public int IMONumber { get; set; }

    [Required]
    public string? VesselName { get; set; }

    [Required]
    public VesselType? VesselType { get; set; }

    [Required]
    public string? Operator { get; set; }

    public VesselRecordDataModel() { }

    public VesselRecordDataModel(VesselRecord vesselRecord)
    {
        Id = vesselRecord.Id;
        IMONumber = vesselRecord.IMONumber;
        VesselName = vesselRecord.VesselName;
        VesselType = vesselRecord.VesselType;
        Operator = vesselRecord.Operator;
    }

}

    