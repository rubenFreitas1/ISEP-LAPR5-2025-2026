using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Domain.Model.Resources;
using ShippingManagement.Domain.Qualifications;
using System.Collections.Generic;

namespace DataModel.Model
{
    public class PhysicalResourceDataModel
    {
        public long Id { get; set; }
        [Required]
        public string? Code { get; set; }
        [Required]
        public string? Name { get; set; }
        [Required]
        public string? Description { get; set; }
        [Required]
        public PhysicalResourceKind Kind { get; set; }
        public int? SetupTimeMinutes { get; set; }
        public int OperationalCapacity { get; set; }
        public string? AssignedArea { get; set; }
        [Required]
        public List<QualificationDataModel>? QualificationRequirements { get; set; }
        public bool IsActive { get; set; }
        public DateTime? DeactivatedAt { get; set; }

        public PhysicalResourceDataModel() { }

        public PhysicalResourceDataModel(PhysicalResource resource)
        {
            Id = resource.Id;
            Code = resource.PhysicalResourceCode;
            Name = resource.Name;
            Description = resource.PhysicalResourceDescription;
            Kind = resource.PhysicalResourceKind;
            SetupTimeMinutes = resource.PhysicalResourceSetupTimeMinutes;
            OperationalCapacity = resource.PhysicalResourceOperationalCapacity;
            AssignedArea = resource.PhysicalResourceAssignedArea;
            QualificationRequirements = resource.PhysicalResourceQualificationRequirements.Select(q => new QualificationDataModel(q)).ToList();
            IsActive = resource.PhysicalResourceIsActive;
            DeactivatedAt = resource.PhysicalResourceDeactivatedAt;
        }
    }
}
