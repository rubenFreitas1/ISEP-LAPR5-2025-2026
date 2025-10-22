using Microsoft.AspNetCore.Mvc;
using Application.Services;
using Application.DTO;
using Domain.IRepository;
using Domain.Model.Resources;
using Domain.Model;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/PhysicalResources")]
    public class PhysicalResourcesController : ControllerBase
    {
        private readonly PhysicalResourceService _service;
        private readonly IQualificationRepository _qualificationRepository;
        private readonly List<string> _errorMessages = new();

        public PhysicalResourcesController(PhysicalResourceService service, IQualificationRepository qualificationRepository)
        {
            _service = service;
            _qualificationRepository = qualificationRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PhysicalResourceDTO>>> GetAll()
        {
            var list = await _service.GetAll();
            if (list == null || !list.Any()) return NotFound();
            return Ok(list);
        }

        [HttpGet("ById/{id}")]
        public async Task<ActionResult<PhysicalResourceDTO>> GetById(long id)
        {
            var dto = await _service.GetById(id);
            if (dto == null) return NotFound();
            return Ok(dto);
        }

        [HttpGet("ByCode/{code}")]
        public async Task<ActionResult<PhysicalResourceDTO>> GetByCode(string code)
        {
            var dto = await _service.GetByCode(code);
            if (dto == null) return NotFound();
            return Ok(dto);
        }

        [HttpGet("Search")]
        public async Task<ActionResult<IEnumerable<PhysicalResourceDTO>>> Search([FromQuery] string? code, [FromQuery] string? name, [FromQuery] string? description, [FromQuery] PhysicalResourceKind? kind, [FromQuery] ResourceStatus? status)
        {
            var result = await _service.Search(code, name, description, kind, status);
            if (result == null || !result.Any()) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<PhysicalResourceDTO>> Post(PhysicalResourceDTO dto)
        {
            _errorMessages.Clear();
            if (dto == null) return BadRequest("Resource data is null.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var created = await _service.Add(dto, _errorMessages);
            if (created == null)
            {
                if (_errorMessages.Any(msg => msg.Contains("already exists", StringComparison.OrdinalIgnoreCase))) return Conflict(_errorMessages);
                return BadRequest(_errorMessages);
            }
            return CreatedAtAction(nameof(GetByCode), new { code = created.Code }, created);
        }

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> Put(long id, PhysicalResourceDTO dto)
        {
            _errorMessages.Clear();
            if (dto == null) return BadRequest("Resource data must be provided.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // Prevent code changes
            var existing = await _service.GetById(id);
            if (existing != null && !string.Equals(existing.Code, dto.Code, StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Resource code cannot be changed.");
            }

            bool updated = await _service.Update(id, dto, _errorMessages);
            if (!updated)
            {
                if (_errorMessages.Any(msg => msg.Contains("already exists", StringComparison.OrdinalIgnoreCase))) return Conflict(_errorMessages);
                return BadRequest(_errorMessages);
            }
            return Ok();
        }
    }
}
