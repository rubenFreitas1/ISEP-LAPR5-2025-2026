using Microsoft.AspNetCore.Mvc;
namespace WebApi.Controllers;

using Application.DTO;
using Application.Services;
using Azure;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/OperationPlan")]


public class OperationPlanController : ControllerBase
{
    private readonly OperationPlanService _operationPlanService;

    List<string> _errorMessages = new List<string>();

    public OperationPlanController(OperationPlanService operationPlanService)
    {
        _operationPlanService = operationPlanService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<OperationPlanDTO>>> GetAllOperationPlans()
    {
        IEnumerable<OperationPlanDTO> operationPlans = await _operationPlanService.GetAllOperationPlans();
        return Ok(operationPlans);
    }

    [HttpGet("ByID/{id}")]
    public async Task<ActionResult<OperationPlanDTO>> GetOperationPlanById(int id)
    {
        OperationPlanDTO? operationPlan = await _operationPlanService.GetOperationPlanById(id);
        if (operationPlan == null)
        {
            return NotFound($"Operation Plan with ID {id} not found.");
        }
        return Ok(operationPlan);
    }

    [HttpGet("ByAuthor/{author}")]
    public async Task<ActionResult<IEnumerable<OperationPlanDTO>>> GetOperationPlansByAuthor(string author)
    {
        IEnumerable<OperationPlanDTO> operationPlans = await _operationPlanService.GetOperationPlanByAuthor(author);
        if (operationPlans == null || !operationPlans.Any())
        {
            return NotFound($"Operation Plans by author {author} not found.");
        }
        return Ok(operationPlans);
    }

    [HttpGet("ByAlgorithm/{algorithm}")]
    public async Task<ActionResult<IEnumerable<OperationPlanDTO>>> GetOperationPlansByAlgorithm(string algorithm)
    {
        IEnumerable<OperationPlanDTO> operationPlans = await _operationPlanService.GetOperationPlanByAlgorithm(algorithm);
        if (operationPlans == null || !operationPlans.Any())
        {
            return NotFound($"Operation Plans with algorithm {algorithm} not found.");
        }
        return Ok(operationPlans);
    }

    [HttpGet("ByTargetDay/{targetDay}")]
    public async Task<ActionResult<OperationPlanDTO>> GetOperationPlansByTargetDay(DateTime targetDay)
    {
        OperationPlanDTO? operationPlan = await _operationPlanService.GetOperationPlanByTargetDay(targetDay);
        if (operationPlan == null)
        {
            return NotFound($"Operation Plans with target day {targetDay.ToShortDateString()} not found.");
        }
        return Ok(operationPlan);
    }

    [HttpPost]
    public async Task<ActionResult<OperationPlanDTO>> PostOperationPlan(OperationPlanDTO operationPlanDTO)
    {
        if (operationPlanDTO == null)
        {
            return BadRequest("Operation Plan data must be provided.");
        }

        OperationPlanDTO? cratedOperationPlan = await _operationPlanService.AddOperationPlan(operationPlanDTO, _errorMessages);

        if (cratedOperationPlan == null && _errorMessages.Any())
        {
            if (_errorMessages.Contains($"An operation plan for the day {operationPlanDTO.TargetDay} already exists."))
            {
                return Conflict(_errorMessages);
            }

            return BadRequest(_errorMessages);
        }
        return CreatedAtAction(nameof(GetOperationPlanById), new { id = cratedOperationPlan!.Id }, cratedOperationPlan);
    }
    
    [HttpPut("Update/{id}")]
    public async Task<IActionResult> PutDock(long id, OperationPlanDTO operationPlanDTO)
    {
        if (operationPlanDTO == null )
        {
            return BadRequest("Operation Plan data must be provided.");
        }
        bool isUpdated = await _operationPlanService.UpdateOperationPlan(id, operationPlanDTO, _errorMessages);
        if (!isUpdated && _errorMessages.Any())
        {
            if (_errorMessages.Any(msg => msg.Contains("already exists", StringComparison.OrdinalIgnoreCase) || msg.Contains("Already exists", StringComparison.OrdinalIgnoreCase)))
            {
                return Conflict(_errorMessages);
            }
            return BadRequest(_errorMessages);
        }
        return Ok();
    }

}