using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using TelnetTeamClient.Interfaces;
using TelnetTeamClient.Models;


namespace TelnetTeamClient.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowSpecificOrigin")] // Apply CORS policy at the controller level
    public class AutorisationsController : ControllerBase
    {
        private readonly IAutorisationsRepository _repository;

        public AutorisationsController(IAutorisationsRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Autorisation>>> GetAutorisations()
        {
            var autorisations = await _repository.GetAutorisations();
            return Ok(autorisations);
        }

        [HttpGet("{autorisationId}")]
        public async Task<ActionResult<Autorisation>> GetAutorisation(int autorisationId)
        {
            var autorisation = await _repository.GetAutorisation(autorisationId);
            if (autorisation == null)
                return NotFound();
            return Ok(autorisation);
        }

        [HttpPost]
        public async Task<ActionResult> AddAutorisation(Autorisation autorisation)
        {
            await _repository.AddAutorisation(autorisation);
            return CreatedAtAction(nameof(GetAutorisation), new { autorisationId = autorisation.AutorisationId }, autorisation);
        }

        [HttpPut("{autorisationId}")]
        public async Task<ActionResult> UpdateAutorisation(int autorisationId, Autorisation autorisation)
        {
            if (autorisationId != autorisation.AutorisationId)
                return BadRequest();

            await _repository.UpdateAutorisation(autorisation);
            return NoContent();
        }

        [HttpDelete("{autorisationId}")]
        public async Task<ActionResult> DeleteAutorisation(int autorisationId)
        {
            await _repository.DeleteAutorisation(autorisationId);
            return NoContent();
        }
    }
}
