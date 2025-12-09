using Domain.Model;
using Xunit;


namespace Domain.Tests
{
    public class IncidentTypeTests
    {
        [Fact]
        public void Constructor_ValidParameters_ShouldCreateInstance()
        {
            var code = "CODE1";
            var name = "Name1";
            var description = "Description1";
            var classification = IncidentClassification.Major;

            var incidentType = new IncidentType(code, name, description, classification);

            Assert.Equal(code, incidentType.Code);
            Assert.Equal(name, incidentType.Name);
            Assert.Equal(description, incidentType.Description);
            Assert.Equal(classification, incidentType.Classification);
            Assert.Null(incidentType.ParentIncidentType);
            Assert.Null(incidentType.ParentIncidentTypeId);
        }

        [Fact]
        public void Constructor_WithParent_ShouldSetParentProperties()
        {
            var parent = new IncidentType("PARENT", "ParentName", "ParentDesc", IncidentClassification.Minor);
            parent.Id = 10;
            var incidentType = new IncidentType("CODE2", "Name2", "Desc2", IncidentClassification.Critical, parent);

            Assert.Equal(parent, incidentType.ParentIncidentType);
            Assert.Equal(parent.Id, incidentType.ParentIncidentTypeId);
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("   ")]
        public void Constructor_InvalidName_ShouldThrow(string invalidName)
        {
            var code = "CODE";
            var description = "Desc";
            var classification = IncidentClassification.Minor;
            var ex = Assert.Throws<ArgumentException>(() => new IncidentType(code, invalidName, description, classification));
            Assert.Equal("name", ex.ParamName);
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("   ")]
        public void Constructor_InvalidCode_ShouldThrow(string invalidCode)
        {
            var name = "Name";
            var description = "Desc";
            var classification = IncidentClassification.Minor;
            var ex = Assert.Throws<ArgumentException>(() => new IncidentType(invalidCode, name, description, classification));
            Assert.Equal("code", ex.ParamName);
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("   ")]
        public void Constructor_InvalidDescription_ShouldThrow(string invalidDesc)
        {
            var code = "CODE";
            var name = "Name";
            var classification = IncidentClassification.Minor;
            var ex = Assert.Throws<ArgumentException>(() => new IncidentType(code, name, invalidDesc, classification));
            Assert.Equal("description", ex.ParamName);
        }

        [Fact]
        public void UpdateName_Valid_ShouldUpdate()
        {
            var incidentType = new IncidentType("CODE", "OldName", "Desc", IncidentClassification.Minor);
            incidentType.UpdateName("NewName");
            Assert.Equal("NewName", incidentType.Name);
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("   ")]
        public void UpdateName_Invalid_ShouldThrow(string invalidName)
        {
            var incidentType = new IncidentType("CODE", "Name", "Desc", IncidentClassification.Minor);
            var ex = Assert.Throws<ArgumentException>(() => incidentType.UpdateName(invalidName));
            Assert.Equal("name", ex.ParamName);
        }

        [Fact]
        public void UpdateDescription_Valid_ShouldUpdate()
        {
            var incidentType = new IncidentType("CODE", "Name", "OldDesc", IncidentClassification.Minor);
            incidentType.UpdateDescription("NewDesc");
            Assert.Equal("NewDesc", incidentType.Description);
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("   ")]
        public void UpdateDescription_Invalid_ShouldThrow(string invalidDesc)
        {
            var incidentType = new IncidentType("CODE", "Name", "Desc", IncidentClassification.Minor);
            var ex = Assert.Throws<ArgumentException>(() => incidentType.UpdateDescription(invalidDesc));
            Assert.Equal("description", ex.ParamName);
        }

        [Fact]
        public void UpdateClassification_ShouldUpdate()
        {
            var incidentType = new IncidentType("CODE", "Name", "Desc", IncidentClassification.Minor);
            incidentType.UpdateClassification(IncidentClassification.Critical);
            Assert.Equal(IncidentClassification.Critical, incidentType.Classification);
        }

        [Fact]
        public void UpdateParentIncidentType_NewParent_ShouldUpdate()
        {
            var incidentType = new IncidentType("CODE", "Name", "Desc", IncidentClassification.Minor);
            var parent = new IncidentType("PARENT", "ParentName", "ParentDesc", IncidentClassification.Major);
            parent.Id = 99;
            incidentType.UpdateParentIncidentType(parent);
            Assert.Equal(parent, incidentType.ParentIncidentType);
            Assert.Equal(parent.Id, incidentType.ParentIncidentTypeId);
        }

        [Fact]
        public void UpdateParentIncidentType_Null_ShouldRemoveParent()
        {
            var parent = new IncidentType("PARENT", "ParentName", "ParentDesc", IncidentClassification.Major);
            parent.Id = 99;
            var incidentType = new IncidentType("CODE", "Name", "Desc", IncidentClassification.Minor, parent);
            incidentType.UpdateParentIncidentType(null);
            Assert.Null(incidentType.ParentIncidentType);
            Assert.Null(incidentType.ParentIncidentTypeId);
        }

        [Fact]
        public void Hierarchy_ThreeLevels_ShouldLinkCorrectly()
        {
            var grandparent = new IncidentType("GP", "Grandparent", "GPDesc", IncidentClassification.Critical);
            grandparent.Id = 1;
            var parent = new IncidentType("P", "Parent", "PDesc", IncidentClassification.Major, grandparent);
            parent.Id = 2;
            var child = new IncidentType("C", "Child", "CDesc", IncidentClassification.Minor, parent);
            Assert.Equal(parent, child.ParentIncidentType);
            Assert.Equal(grandparent, parent.ParentIncidentType);
            Assert.Equal(2, child.ParentIncidentTypeId);
            Assert.Equal(1, parent.ParentIncidentTypeId);
        }

        [Theory]
        [InlineData("CODEA", "NameA", "DescA", IncidentClassification.Minor)]
        [InlineData("CODEB", "NameB", "DescB", IncidentClassification.Major)]
        [InlineData("CODEC", "NameC", "DescC", IncidentClassification.Critical)]
        public void Constructor_Theory_ShouldCreateCorrectly(string code, string name, string description, IncidentClassification classification)
        {
            var incidentType = new IncidentType(code, name, description, classification);
            Assert.Equal(code, incidentType.Code);
            Assert.Equal(name, incidentType.Name);
            Assert.Equal(description, incidentType.Description);
            Assert.Equal(classification, incidentType.Classification);
        }

        [Theory]
        [InlineData("OldName", "NewName")]
        [InlineData("Name1", "Name2")]
        public void UpdateName_Theory_ShouldUpdate(string oldName, string newName)
        {
            var incidentType = new IncidentType("CODE", oldName, "Desc", IncidentClassification.Minor);
            incidentType.UpdateName(newName);
            Assert.Equal(newName, incidentType.Name);
        }

        [Theory]
        [InlineData("OldDesc", "NewDesc")]
        [InlineData("Desc1", "Desc2")]
        public void UpdateDescription_Theory_ShouldUpdate(string oldDesc, string newDesc)
        {
            var incidentType = new IncidentType("CODE", "Name", oldDesc, IncidentClassification.Minor);
            incidentType.UpdateDescription(newDesc);
            Assert.Equal(newDesc, incidentType.Description);
        }

        [Theory]
        [InlineData(IncidentClassification.Minor, IncidentClassification.Major)]
        [InlineData(IncidentClassification.Major, IncidentClassification.Critical)]
        [InlineData(IncidentClassification.Critical, IncidentClassification.Minor)]
        public void UpdateClassification_Theory_ShouldUpdate(IncidentClassification initial, IncidentClassification updated)
        {
            var incidentType = new IncidentType("CODE", "Name", "Desc", initial);
            incidentType.UpdateClassification(updated);
            Assert.Equal(updated, incidentType.Classification);
        }
    }
}