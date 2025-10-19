namespace DataModel.Repository;

using System.Runtime.Serialization.Formatters;
using DataModel.Mapper;
using DataModel.Model;
using Domain.IRepository;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Domain.Model;

/*
public class ShippingAgentOrganizationRepository : GenericRepository<ShippingAgentOrganization>, IShippingAgentOrganizationRepository
{
    ShippingAgentOrganizationMapper _saMapper;

    public ShippingAgentOrganizationRepository(ShippingManagementContext context, ShippingAgentOrganizationMapper mapper) : base(context!)
    {
        _saMapper = mapper;
    }

    public async Task<IEnumerable<ShippingAgentOrganization>> GetShippingAgentOrganizationsAsync()
    {
        try
        {
            IEnumerable<ShippingAgentOrganizationDataModel> saDataModels = await _context.Set<ShippingAgentOrganizationDataModel>()
                    .ToListAsync();
            IEnumerable<ShippingAgentOrganization> shippingAgents = _saMapper.ToDomain(saDataModels);
            return shippingAgents;
        }
        catch
        {
            throw;
        }
    }

    public async Task<ShippingAgentOrganization?> GetShippingAgentOrganizationByCodeAsync(string code)
    {
        try
        {
            ShippingAgentOrganizationDataModel? saDM = await _context.Set<ShippingAgentOrganizationDataModel>()
            .SingleOrDefaultAsync(sa => sa.Code == code);
            if (saDM != null)
            {
                ShippingAgentOrganization sa = _saMapper.ToDomain(saDM);
                return sa;
            }
            return null;
        }
        catch
        {
            return null; throw;
        }
    }

    public async Task<ShippingAgentOrganization?> GetShippingAgentOrganizationByIdAsync(long id)
    {
        try
        {
            ShippingAgentOrganizationDataModel? saDM = await _context.Set<ShippingAgentOrganizationDataModel>()
            .SingleOrDefaultAsync(sa => sa.Id == id);
            if (saDM != null)
            {
                ShippingAgentOrganization sa = _saMapper.ToDomain(saDM);
                return sa;
            }
            return null;
        }
        catch
        {
            return null; throw;
        }
    }

    public async Task<IEnumerable<ShippingAgentOrganization?>> GetShippingAgentOrganizationByLegalNameAsync(string legalName)
    {
        try
        {
            IEnumerable<ShippingAgentOrganizationDataModel>? saDMs = await _context.Set<ShippingAgentOrganizationDataModel>()
            .Where(sa => sa.LegalName == legalName)
            .ToListAsync();
            IEnumerable<ShippingAgentOrganization> shippingAgents = _saMapper.ToDomain(saDMs);
            return shippingAgents;
        }
        catch
        {
            throw;
        }
    }

    public async Task<ShippingAgentOrganization> AddShippingAgentOrganizationAsync(ShippingAgentOrganization sa)
    {
        try
        {
            ShippingAgentOrganizationDataModel saDM = _saMapper.ToDataModel(sa);
            EntityEntry<ShippingAgentOrganizationDataModel> shippingAgentDM_EE = _context.Set<ShippingAgentOrganizationDataModel>().Add(saDM);
            await _context.SaveChangesAsync();
            ShippingAgentOrganizationDataModel addedEntry = shippingAgentDM_EE.Entity;
            ShippingAgentOrganization addedSA = _saMapper.ToDomain(addedEntry);
            return addedSA;
        }
        catch
        {
            throw;
        }
    }

    public async Task<ShippingAgentOrganization?> Update(ShippingAgentOrganization sa, List<string> errorMessages)
    {
        try
        {
            var shippingAgentDataModel = await _context.Set<ShippingAgentOrganizationDataModel>()
                .FirstOrDefaultAsync(v => v.Id == sa.Id);

            if (shippingAgentDataModel == null)
            {
                errorMessages.Add("Shipping Agent Organization not found.");
                return null;
            }
            _saMapper.UpdateDataModelFromDomain(shippingAgentDataModel, sa);
            await _context.SaveChangesAsync();
            return _saMapper.ToDomain(shippingAgentDataModel);
        }
        catch (DbUpdateConcurrencyException)
        {
            errorMessages.Add("Concurrency error occurred while updating the Shipping Agent Organization.");
            return null;
        }
        catch (Exception ex)
        {
            errorMessages.Add($"Unexpected error: {ex.Message}");
            throw;
        }
    }

    public async Task<bool> ShippingAgentExists(long id)
    {
        return await _context.Set<ShippingAgentOrganizationDataModel>().AnyAsync(sa => sa.Id == id);
    }
}*/
