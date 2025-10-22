using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using ShippingManagement.Domain.Qualifications;

namespace Domain.Model.Resources
{
    public enum PhysicalResourceKind
    {
        CraneFixed,
        CraneMobile,
        Truck,
        Other
    }

    public class PhysicalResource : Resource
    {
        public string PhysicalResourceCode { get; private set; }
        public string PhysicalResourceDescription { get; private set; }
        public PhysicalResourceKind PhysicalResourceKind { get; private set; }
        public int? PhysicalResourceSetupTimeMinutes { get; private set; }
        public int PhysicalResourceOperationalCapacity { get; private set; }
        public string? PhysicalResourceAssignedArea { get; private set; }
        public IEnumerable<Qualification> PhysicalResourceQualificationRequirements { get; private set; }
        public bool PhysicalResourceIsActive { get; private set; }
        public DateTime? PhysicalResourceDeactivatedAt { get; private set; }

        protected PhysicalResource() : base()
        {
            PhysicalResourceCode = string.Empty;
            PhysicalResourceDescription = string.Empty;
            PhysicalResourceQualificationRequirements = Enumerable.Empty<Qualification>();
            PhysicalResourceIsActive = true;
        }

        public PhysicalResource(string code, string name, string description, PhysicalResourceKind kind, IEnumerable<Qualification> qualificationRequirements, int operationalCapacity, string? assignedArea = null, int? setupTimeMinutes = null, OperationalWindow? operationalWindow = null, ResourceStatus status = ResourceStatus.Available)
            : base(name, qualificationRequirements ?? Enumerable.Empty<Qualification>(), operationalWindow ?? new OperationalWindow(startDay: DayOfWeek.Monday, endDay: DayOfWeek.Friday, startTime: new TimeSpan(9, 0, 0), endTime: new TimeSpan(17, 0, 0)), status)
        {
            ValidateCode(code);
            ValidateDescription(description);
            ValidateOperationalCapacity(operationalCapacity);

            PhysicalResourceCode = code.Trim();
            PhysicalResourceDescription = description.Trim();
            PhysicalResourceKind = kind;
            PhysicalResourceQualificationRequirements = qualificationRequirements ?? Enumerable.Empty<Qualification>();
            PhysicalResourceOperationalCapacity = operationalCapacity;
            PhysicalResourceAssignedArea = string.IsNullOrWhiteSpace(assignedArea) ? null : assignedArea!.Trim();
            PhysicalResourceSetupTimeMinutes = setupTimeMinutes;
            PhysicalResourceIsActive = true;
        }

        public void ChangeDescription(string description)
        {
            ValidateDescription(description);
            PhysicalResourceDescription = description.Trim();
        }

        public void ChangeAssignedArea(string? area)
        {
            PhysicalResourceAssignedArea = string.IsNullOrWhiteSpace(area) ? null : area!.Trim();
        }

        public void ChangeOperationalCapacity(int capacity)
        {
            ValidateOperationalCapacity(capacity);
            PhysicalResourceOperationalCapacity = capacity;
        }

        public void ChangeSetupTime(int? minutes)
        {
            if (minutes.HasValue && minutes < 0) throw new ArgumentOutOfRangeException(nameof(minutes), "Setup time cannot be negative.");
            PhysicalResourceSetupTimeMinutes = minutes;
        }

        public void ChangeKind(PhysicalResourceKind kind)
        {
            PhysicalResourceKind = kind;
        }

        public void ChangeQualificationRequirements(IEnumerable<Qualification> qualificationRequirements)
        {
            PhysicalResourceQualificationRequirements = qualificationRequirements ?? Enumerable.Empty<Qualification>();
        }

        public void Deactivate()
        {
            PhysicalResourceIsActive = false;
            PhysicalResourceDeactivatedAt = DateTime.UtcNow;
            ChangeStatus(ResourceStatus.Unavailable);
        }

        public void Reactivate()
        {
            PhysicalResourceIsActive = true;
            PhysicalResourceDeactivatedAt = null;
            ChangeStatus(ResourceStatus.Available);
        }

        private static void ValidateCode(string code)
        {
            if (string.IsNullOrWhiteSpace(code)) throw new ArgumentException("Code cannot be null or empty.", nameof(code));
            var trimmed = code.Trim();
            if (trimmed.Length > 20) throw new ArgumentException("Code must be at most 20 characters long.", nameof(code));
            if (!Regex.IsMatch(trimmed, "^[A-Za-z0-9-]+$")) throw new ArgumentException("Code must be alphanumeric (dashes allowed).", nameof(code));
        }

        private static void ValidateDescription(string description)
        {
            if (string.IsNullOrWhiteSpace(description)) throw new ArgumentException("Description cannot be null or empty.", nameof(description));
            if (description.Trim().Length > 250) throw new ArgumentException("Description must be at most 250 characters long.", nameof(description));
        }

        private static void ValidateOperationalCapacity(int capacity)
        {
            if (capacity < 0) throw new ArgumentOutOfRangeException(nameof(capacity), "Operational capacity cannot be negative.");
        }
    }
}
