namespace Domain.Model;

public enum IncidentClassification
{
    Minor,
    Major,
    Critical
}


public class IncidentType
{
    public long Id { get; set; }

    public string Code { get; private set; } = string.Empty;
    public string Name { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public IncidentClassification Classification { get; private set; }

    public long? ParentIncidentTypeId { get; set; }
    public IncidentType? ParentIncidentType { get; private set; }

    private IncidentType() { }

    public IncidentType(string code, string name, string description, IncidentClassification classification, IncidentType? parent = null)
    {
        ValidateName(name);
        ValidateCode(code);
        ValidateDescription(description);

        Code = code;
        Name = name;
        Description = description;
        Classification = classification;
        ParentIncidentType = parent;
        ParentIncidentTypeId = parent?.Id;
    }



    private void ValidateName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Incident type name cannot be null or empty.", nameof(name));
    }

    private void ValidateCode(string code)
    {
        if (string.IsNullOrWhiteSpace(code))
            throw new ArgumentException("Incident type code cannot be null or empty.", nameof(code));
    }

    private void ValidateDescription(string description)
    {
        if (string.IsNullOrWhiteSpace(description))
            throw new ArgumentException("Incident type description cannot be null or empty.", nameof(description));
    }

    public void UpdateName(string name)
    {
        ValidateName(name);
        Name = name;
    }

    public void UpdateDescription(string description)
    {
        ValidateDescription(description);
        Description = description;
    }

    public void UpdateClassification(IncidentClassification classification)
    {
        Classification = classification;
    }

    public void UpdateParentIncidentType(IncidentType? parent)
    {
        ParentIncidentType = parent;
        ParentIncidentTypeId = parent?.Id;
    }
}