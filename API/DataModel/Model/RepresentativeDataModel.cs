using System.ComponentModel.DataAnnotations;
using Domain.Model;

namespace DataModel.Model;

public class RepresentativeDataModel
{

    public long Id { get; set; }

    [Required]
    public ShippingAgentOrganizationDataModel? Organization { get; set; }

    [Required]
    public string? Name { get; set; }

    [Required]
    public string? CitizenId { get; set; }

    [Required]
    public string? Nationality { get; set; }

    [Required]
    public string? Email { get; set; }

    [Required]
    public string? PhoneNumber { get; set; }

    public string? Role { get; set; }

    public string? Status { get; set; }

    public bool IsFirstTime { get; set; }

    public DateTime LastModifiedAt { get; set; }

    public RepresentativeDataModel() { }

    public RepresentativeDataModel(Representative representative)
    {
        Id = representative.Id;
        Organization = new ShippingAgentOrganizationDataModel(representative.Organization!);
        Name = representative.Name;
        CitizenId = representative.CitizenId;
        Nationality = representative.Nationality;
        Email = representative.Email;
        PhoneNumber = representative.PhoneNumber;
        LastModifiedAt = representative.LastModifiedAt;
        Role = representative.Role.ToString();
        Status = representative.Status.ToString();
        IsFirstTime = representative.IsFirstTime;
    }

}