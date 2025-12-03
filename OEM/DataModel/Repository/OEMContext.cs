namespace DataModel.Repository;

using DataModel.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using DataModel.Configurations;

public class OEMContext : DbContext
{
    protected readonly IConfiguration? Configuration;

    public OEMContext(DbContextOptions<OEMContext> options)
        : base(options)
    {
    }

    public virtual DbSet<IncidentTypeDataModel> IncidentTypes { get; set; } = null!;
    public virtual DbSet<OperationPlanDataModel> OperationPlans { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new IncidentTypeConfiguration());
        modelBuilder.ApplyConfiguration(new OperationPlanConfiguration());
    }

}