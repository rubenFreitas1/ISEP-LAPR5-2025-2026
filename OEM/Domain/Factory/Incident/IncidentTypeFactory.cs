namespace Domain.Factory;


using Domain.Model;


public class IncidentTypeFactory : IIncidentTypeFactory
{
    public IncidentType NewIncidentType(string code, string name, string description, IncidentClassification classification, IncidentType? parent = null)
    {
        return new IncidentType(code, name, description, classification, parent);
    }
}