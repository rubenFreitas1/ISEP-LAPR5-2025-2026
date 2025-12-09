namespace Application.Services;


using Domain.Model;

using Microsoft.EntityFrameworkCore;
using Domain.IRepository;
using Application.DTO;
using Domain.Factory;
using System.Collections;

public class IncidentTypeService
{
    private readonly IIncidentTypeRepository _incidentTypeRepository;
    private readonly IIncidentTypeFactory _incidentTypeFactory;

    public IncidentTypeService(IIncidentTypeRepository incidentTypeRepository, IIncidentTypeFactory incidentTypeFactory)
    {
        _incidentTypeRepository = incidentTypeRepository;
        _incidentTypeFactory = incidentTypeFactory;
    }

    public async Task<IEnumerable<IncidentTypeDTO>> GetAllIncidentTypes()
    {
        IEnumerable<IncidentType> incidentTypes = await _incidentTypeRepository.GetAllIncidentTypes();
        IEnumerable<IncidentTypeDTO> incidentTypeDTOs = IncidentTypeDTO.ToDTO(incidentTypes);
        return incidentTypeDTOs;
    }

    public async Task<IncidentTypeDTO?> GetIncidentTypeByIdAsync(long id)
    {
        IncidentType? incidentType = await _incidentTypeRepository.GetIncidentTypeByIdAsync(id);
        if (incidentType == null)
        {
            return null;
        }
        IncidentTypeDTO incidentTypeDTO = IncidentTypeDTO.ToDTO(incidentType);
        return incidentTypeDTO;
    }

    public async Task<IncidentTypeDTO?> GetIncidentTypeByCodeAsync(string code)
    {
        IncidentType? incidentType = await _incidentTypeRepository.GetIncidentTypeByCodeAsync(code);
        if (incidentType == null)
        {
            return null;
        }
        IncidentTypeDTO incidentTypeDTO = IncidentTypeDTO.ToDTO(incidentType);
        return incidentTypeDTO;
    }

    public async Task<IEnumerable<IncidentTypeDTO>> GetIncidentTypesByClassificationAsync(IncidentClassification classification)
    {
        IEnumerable<IncidentType> incidentTypes = await _incidentTypeRepository.GetIncidentTypesByClassificationAsync(classification);
        IEnumerable<IncidentTypeDTO> incidentTypeDTOs = IncidentTypeDTO.ToDTO(incidentTypes);
        return incidentTypeDTOs;
    }

    public async Task<IEnumerable<IncidentTypeDTO>> GetIncidentTypesByParentAsync(string code )
    {
        IncidentType? parentIncidentType = await _incidentTypeRepository.GetIncidentTypeByCodeAsync(code);
        if (parentIncidentType == null)
        {
            return new List<IncidentTypeDTO>();
        }
        IEnumerable<IncidentType> incidentTypes = await _incidentTypeRepository.GetIncidentTypesByParent(parentIncidentType);
        IEnumerable<IncidentTypeDTO> incidentTypeDTOs = IncidentTypeDTO.ToDTO(incidentTypes);
        return incidentTypeDTOs;
    }

    public async Task<IEnumerable<IncidentTypeDTO>> GetIncidentTypesWithParentAsync(bool hasParent)
    {
        IEnumerable<IncidentType> incidentTypes = await _incidentTypeRepository.GetIncidentTypesWithParentAsync(hasParent);
        IEnumerable<IncidentTypeDTO> incidentTypeDTOs = IncidentTypeDTO.ToDTO(incidentTypes);
        return incidentTypeDTOs;
    }

    public async Task<IncidentTypeDTO?> AddIncidentType(IncidentTypeDTO incidentTypeDTO, List<string> errorMessages)
    {
        IncidentType? incidentType = await _incidentTypeRepository.GetIncidentTypeByCodeAsync(incidentTypeDTO.Code);
        if (incidentType != null)
        {
            errorMessages.Add($"An incident type with code '{incidentTypeDTO.Code}' already exists.");
            return null;
        }
        IncidentType? parentIncidentType = null;
        if(incidentTypeDTO.ParentIncidentTypeCode != null)
        {
            parentIncidentType = await _incidentTypeRepository.GetIncidentTypeByCodeAsync(incidentTypeDTO.ParentIncidentTypeCode);
            if (parentIncidentType == null)
            {
                errorMessages.Add($"Parent incident type with code '{incidentTypeDTO.ParentIncidentTypeCode}' does not exist.");
                return null;
            }
        }
        IncidentType? incidentTypeName = await _incidentTypeRepository.GetIncidentTypeByNameAsync(incidentTypeDTO.Name);
        if (incidentTypeName != null)
        {
            errorMessages.Add($"An incident type with name '{incidentTypeDTO.Name}' already exists.");
            return null;
        }
        if(!Enum.IsDefined(typeof(IncidentClassification), incidentTypeDTO.Classification))
        {
            errorMessages.Add($"Invalid incident classification '{incidentTypeDTO.Classification}'.");
            return null;
        }
        try
        {
            if(parentIncidentType == null)
            {
                incidentType = _incidentTypeFactory.NewIncidentType(incidentTypeDTO.Code, incidentTypeDTO.Name, incidentTypeDTO.Description, incidentTypeDTO.Classification);
            }else
            {
                incidentType = _incidentTypeFactory.NewIncidentType(incidentTypeDTO.Code, incidentTypeDTO.Name, incidentTypeDTO.Description, incidentTypeDTO.Classification, parentIncidentType);
            }
        }catch (ArgumentException ex)
        {
            errorMessages.Add("Error in converting DTO to Domain: " + ex.Message);
            return null;
        }
        IncidentType addedIncidentType = await _incidentTypeRepository.AddIncidentType(incidentType);
        IncidentTypeDTO addedIncidentTypeDTO = IncidentTypeDTO.ToDTO(addedIncidentType);
        return addedIncidentTypeDTO;
    }
   
    public async Task<bool> UpdateIncidentType(string code,IncidentTypeDTO incidentTypeDTO, List<string> errorMessages)
    {
        IncidentType? existingIncidentType = await _incidentTypeRepository.GetIncidentTypeByCodeAsync(code);
        if (existingIncidentType == null)
        {
            errorMessages.Add($"Incident type with code '{code}' does not exist.");
            return false;
        }
        IncidentType? incidentTypeWithNewCode = await _incidentTypeRepository.GetIncidentTypeByCodeAsync(incidentTypeDTO.Code);
        if (incidentTypeWithNewCode != null && incidentTypeWithNewCode.Id != existingIncidentType.Id)
        {
            errorMessages.Add($"Its not possible to update the Incident type code.");
            return false;
        }
        IncidentType? incidentTypeName = await _incidentTypeRepository.GetIncidentTypeByNameAsync(incidentTypeDTO.Name);
        if (incidentTypeName != null && incidentTypeName.Id != existingIncidentType.Id)
        {
            errorMessages.Add($"An incident type with name '{incidentTypeDTO.Name}' already exists.");
            return false;
        }
        IncidentType? parentIncidentType = null;
        if(incidentTypeDTO.ParentIncidentTypeCode != null)
        {
            parentIncidentType = await _incidentTypeRepository.GetIncidentTypeByCodeAsync(incidentTypeDTO.ParentIncidentTypeCode);
            if (parentIncidentType == null)
            {
                errorMessages.Add($"Parent incident type with code '{incidentTypeDTO.ParentIncidentTypeCode}' does not exist.");
                return false;
            }
        }
        try
        {
            existingIncidentType.UpdateName(incidentTypeDTO.Name);
            existingIncidentType.UpdateDescription(incidentTypeDTO.Description);
            existingIncidentType.UpdateClassification(incidentTypeDTO.Classification);
            existingIncidentType.UpdateParentIncidentType(parentIncidentType);
            await _incidentTypeRepository.Update(existingIncidentType, errorMessages);
            return true;
        }catch (ArgumentException ex)
        {
            errorMessages.Add("Error: " + ex.Message);
            return false;
        }
    }

}