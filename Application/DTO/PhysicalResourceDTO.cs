using Domain.Model.Resources;
using ShippingManagement.Domain.Qualifications;
using System.Collections.Generic;

namespace Application.DTO
{
    public class PhysicalResourceDTO
    {
        public long? Id { get; set; }
        [System.ComponentModel.DataAnnotations.Required]
        public string Code { get; set; } = string.Empty;
        [System.ComponentModel.DataAnnotations.Required]
        public string Name { get; set; } = string.Empty;
        [System.ComponentModel.DataAnnotations.Required]
        public string Description { get; set; } = string.Empty;
        [System.ComponentModel.DataAnnotations.Required]
        public PhysicalResourceKind Kind { get; set; }
        [System.ComponentModel.DataAnnotations.Required]
        public int SetupTimeMinutes { get; set; }
        [System.ComponentModel.DataAnnotations.Required]
        public int OperationalCapacity { get; set; }
        [System.ComponentModel.DataAnnotations.Required]
        public string AssignedArea { get; set; } = string.Empty;
        [System.ComponentModel.DataAnnotations.Required]
        public IEnumerable<string> QualificationCodes { get; set; } = new List<string>();
        [System.ComponentModel.DataAnnotations.Required]
        public bool IsActive { get; set; }

        public PhysicalResourceDTO() { }

        public static PhysicalResourceDTO ToDTO(PhysicalResource resource)
        {
            return new PhysicalResourceDTO
            {
                Id = resource.Id,
                Code = resource.PhysicalResourceCode,
                Name = resource.Name,
                Description = resource.PhysicalResourceDescription,
                Kind = resource.PhysicalResourceKind,
                SetupTimeMinutes = resource.PhysicalResourceSetupTimeMinutes ?? 0,
                OperationalCapacity = resource.PhysicalResourceOperationalCapacity,
                AssignedArea = resource.PhysicalResourceAssignedArea ?? string.Empty,
                QualificationCodes = resource.PhysicalResourceQualificationRequirements?.Select(q => q.Code).Where(c => c != null).Select(c => c!).ToList() ?? new List<string>(),
                IsActive = resource.PhysicalResourceIsActive
            };
        }
    }
}
