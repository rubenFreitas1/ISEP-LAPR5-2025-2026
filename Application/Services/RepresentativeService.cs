namespace Application.Services;

using Domain.Model;
using Application.DTO;

using Microsoft.EntityFrameworkCore;
using Domain.IRepository;
using Domain.Factory;

public class RepresentativeService
{
    private readonly IRepresentativeRepository _representativeRepository;
    private readonly IRepresentativeFactory _representativeFactory;

    public RepresentativeService(IRepresentativeRepository representativeRepository, IRepresentativeFactory representativeFactory)
    {
        _representativeRepository = representativeRepository;
        _representativeFactory = representativeFactory;
    }

    public async Task<IEnumerable<RepresentativeDTO>> GetRepresentativesAsync()
    {
        IEnumerable<Representative> representatives = await _representativeRepository.GetRepresentativesAsync();
        IEnumerable<RepresentativeDTO> representativeDTOs = RepresentativeDTO.ToDTO(representatives);
        return representativeDTOs;
    }

    public async Task<RepresentativeDTO?> GetRepresentativeById(long id)
    {
        Representative? representative = await _representativeRepository.GetRepresentativeByIdAsync(id);
        if (representative != null)
        {
            RepresentativeDTO representativeDTO = RepresentativeDTO.ToDTO(representative);
            return representativeDTO;
        }
        return null;
    }

    public async Task<RepresentativeDTO?> GetRepresentativeByEmail(string email)
    {
        Representative? representative = await _representativeRepository.GetRepresentativeByEmailAsync(email);
        if (representative != null)
        {
            RepresentativeDTO representativeDTO = RepresentativeDTO.ToDTO(representative);
            return representativeDTO;
        }
        return null;
    }

    public async Task<RepresentativeDTO?> GetRepresentativeByPhoneNumber(string phoneNumber)
    {
        Representative? representative = await _representativeRepository.GetRepresentativeByPhoneNumberAsync(phoneNumber);
        if (representative != null)
        {
            RepresentativeDTO representativeDTO = RepresentativeDTO.ToDTO(representative);
            return representativeDTO;
        }
        return null;
    }

    public async Task<RepresentativeDTO?> GetRepresentativeByCitizenId(string citizenId)
    {
        Representative? representative = await _representativeRepository.GetRepresentativeByCitizenIdAsync(citizenId);
        if (representative != null)
        {
            RepresentativeDTO representativeDTO = RepresentativeDTO.ToDTO(representative);
            return representativeDTO;
        }
        return null;
    }

    public async Task<RepresentativeDTO?> AddRepresentative(RepresentativeDTO representativeDTO, List<string> errorMessages)
    {
        Representative? representative;
        Representative? representativeByCitizenID = await _representativeRepository.GetRepresentativeByCitizenIdAsync(representativeDTO.CitizenId!);
        if (representativeByCitizenID != null)
        {
            errorMessages.Add($"A vessel Record with the IMO number '{representativeDTO.CitizenId}' already exists.");
            return null;
        }

        Representative? representativeByEmail = await _representativeRepository.GetRepresentativeByEmailAsync(representativeDTO.Email!);
        if (representativeByEmail != null)
        {
            errorMessages.Add($"A vessel Record with the Email '{representativeDTO.Email}' already exists.");
            return null;
        }

        Representative? representativeByPhoneNumber = await _representativeRepository.GetRepresentativeByPhoneNumberAsync(representativeDTO.PhoneNumber!);
        if (representativeByPhoneNumber != null)
        {
            errorMessages.Add($"A vessel Record with the Phone Number '{representativeDTO.PhoneNumber}' already exists.");
            return null;
        }

        try
        {
            representative = _representativeFactory.NewRepresentative(
                representativeDTO.Name!,
                representativeDTO.CitizenId!,
                representativeDTO.Nationality!,
                representativeDTO.Email!,
                representativeDTO.PhoneNumber!
            );
        }
        catch (ArgumentException ex)
        {
            errorMessages.Add("Error in converting DTO to Domain:" + ex.Message);
            return null;
        }

        Representative addedRepresentative = await _representativeRepository.AddRepresentative(representative);
        RepresentativeDTO addedRepresentativeDTO = RepresentativeDTO.ToDTO(addedRepresentative);
        return addedRepresentativeDTO;
    }




}