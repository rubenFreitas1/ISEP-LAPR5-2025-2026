namespace Domain.Factory;


using Domain.Model;

public interface IIncidentTypeFactory
{
    IncidentType NewIncidentType(string code, string name, string description, IncidentClassification classification, IncidentType? parent = null);
}