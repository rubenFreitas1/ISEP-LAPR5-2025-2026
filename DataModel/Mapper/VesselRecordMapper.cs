namespace DataModel.Mapper;

using DataModel.Model;
using Domain.Factory;
using Domain.Model;

public class VesselRecordMapper
{
    private IVesselRecordFactory _vesselRecordFactory;

    public VesselRecordMapper(IVesselRecordFactory vesselRecordFactory)
    {
        _vesselRecordFactory = vesselRecordFactory;
    }

    public VesselRecord ToDomain(VesselRecordDataModel vesselRecordDM)
    {
        VesselRecord vesselRecordDomain = _vesselRecordFactory.NewVesselRecord(vesselRecordDM.IMONumber, vesselRecordDM.VesselName!, vesselRecordDM.VesselType!, vesselRecordDM.Operator!);
        vesselRecordDomain.Id = vesselRecordDM.Id;
        return vesselRecordDomain;
    }

    public IEnumerable<VesselRecord> ToDomain(IEnumerable<VesselRecordDataModel> vesselRecordDataModels)
    {
        List<VesselRecord> vesselRecordsDomain = new List<VesselRecord>();

        foreach (VesselRecordDataModel vesselRecordDataModel in vesselRecordDataModels)
        {
            VesselRecord vesselRecord = ToDomain(vesselRecordDataModel);
            vesselRecordsDomain.Add(vesselRecord);
        }
        return vesselRecordsDomain.AsEnumerable();
    }

    public VesselRecordDataModel ToDataModel(VesselRecord vesselRecord)
    {
        VesselRecordDataModel vesselRecordDataModel = new VesselRecordDataModel(vesselRecord);
        return vesselRecordDataModel;
    }

    public void UpdateDataModel(VesselRecordDataModel vesselRecordDM, VesselRecord vesselRecord)
    {
        vesselRecordDM.IMONumber = vesselRecord.IMONumber;
        vesselRecordDM.VesselName = vesselRecord.VesselName;
        vesselRecordDM.VesselType = vesselRecord.VesselType;
        vesselRecordDM.Operator = vesselRecord.Operator;
    }
}

    