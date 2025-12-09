namespace DataModel.Configurations;

using DataModel.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class IncidentTypeConfiguration : IEntityTypeConfiguration<IncidentTypeDataModel>
{
    public void Configure(EntityTypeBuilder<IncidentTypeDataModel> builder)
    {
        builder.HasKey(it => it.Id);

        builder.HasIndex(it => it.Code)
            .IsUnique();
        builder.Property(it => it.Code)
            .IsRequired();

        builder.Property(it => it.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(it => it.Description)
            .IsRequired()
            .HasMaxLength(500);

        builder.HasOne(it => it.ParentIncidentType)
            .WithMany()
            .HasForeignKey(it => it.ParentIncidentTypeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
