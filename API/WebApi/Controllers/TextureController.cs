using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System;
using System.IO;
using Application.Services;
using Application.DTO;
using Domain.IRepository;
using Domain.Model.Resources;
using Domain.Model;
using System.Linq;

namespace WebApi.Controllers
{

    [ApiController]
    [Route("api/Texture")]
    public class TextureController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public TextureController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpGet("Texture")]
        public IActionResult GetLayout()
        {
            var projectRoot = Path.GetFullPath(Path.Combine(_env.ContentRootPath, ".."));
            var filePath = Path.Combine(projectRoot, "Textures", "textures.json");

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound($"textures.json not found at {filePath}");
            }

            var json = System.IO.File.ReadAllText(filePath);
            return Content(json, "application/json");
        }
    }

}
