using Domain.Model.Resources;
using ShippingManagement.Domain.Qualifications;

namespace Domain.Factory
{
    public class PhysicalResourceFactory : IPhysicalResourceFactory
    {
        public PhysicalResource NewPhysicalResource(string code, string name, string description, PhysicalResourceKind kind, IEnumerable<Qualification> qualificationRequirements, int operationalCapacity, string? assignedArea = null, int? setupTimeMinutes = null)
        {
            return new PhysicalResource(code, name, description, kind, qualificationRequirements, operationalCapacity, assignedArea, setupTimeMinutes);
        }
    }
}
