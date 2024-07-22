using Microsoft.AspNetCore.Mvc;
using TelnetTeamClient.Interfaces;
using TelnetTeamClient.Models;
using TelnetTeamClient.DTO;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace TelnetTeamClient.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UtilisateurController : ControllerBase
    {
        private readonly IUtilisateurRepository _repository;
        private readonly IConfiguration _configuration;

        public UtilisateurController(IUtilisateurRepository repository, IConfiguration configuration)
        {
            _repository = repository;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Utilisateur>>> GetUtilisateurs()
        {
            var utilisateurs = await _repository.GetUtilisateurs();
            return Ok(utilisateurs);
        }

        [HttpGet("{matricule}")]
        public async Task<ActionResult<UtilisateurDetailsDto>> GetUtilisateur(int matricule)
        {
            var utilisateur = await _repository.GetUtilisateur(matricule);
            if (utilisateur == null)
                return NotFound();
            return Ok(utilisateur);
        }

        [HttpGet("groupe/{groupeId}")]
        public async Task<ActionResult<IEnumerable<Utilisateur>>> GetUtilisateursByGroupeId(int groupeId)
        {
            var utilisateurs = await _repository.GetUtilisateursByGroupeId(groupeId);
            if (!utilisateurs.Any())
                return NotFound();
            return Ok(utilisateurs);
        }

        [HttpPost]
        public async Task<ActionResult> AddUtilisateur(UtilisateurDto utilisateurDto)
        {
            var utilisateur = new Utilisateur
            {
                Nom = utilisateurDto.Nom,
                Prenom = utilisateurDto.Prenom,
                Email = utilisateurDto.Email,
                MotDePasse = utilisateurDto.MotDePasse,
                Role = utilisateurDto.Role
            };

            await _repository.AddUtilisateur(utilisateur);
            return CreatedAtAction(nameof(GetUtilisateur), new { matricule = utilisateur.Matricule }, utilisateur);
        }

        [HttpPut("{matricule}")]
        public async Task<ActionResult> UpdateUtilisateur(int matricule, Utilisateur utilisateur)
        {
            if (matricule != utilisateur.Matricule)
                return BadRequest();

            await _repository.UpdateUtilisateur(utilisateur);
            return NoContent();
        }

        [HttpDelete("{matricule}")]
        public async Task<ActionResult> DeleteUtilisateur(int matricule)
        {
            await _repository.DeleteUtilisateur(matricule);
            return NoContent();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (loginDto == null || loginDto.Matricule <= 0 || string.IsNullOrEmpty(loginDto.MotDePasse))
            {
                return BadRequest("Invalid client request");
            }

            var utilisateur = await _repository.GetUtilisateurByMatriculeAndPassword(loginDto.Matricule, loginDto.MotDePasse);

            if (utilisateur == null)
            {
                return Unauthorized();
            }

            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
            var signingKey = new SymmetricSecurityKey(key);

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, utilisateur.Matricule.ToString()),
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"]
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new { Token = tokenString });
        }

        [HttpPut("updateCongesDispo")]
        public async Task<IActionResult> UpdateCongesDispo([FromBody] UpdateCongesDispoDto updateDto)
        {
            if (updateDto == null || updateDto.Matricule <= 0)
            {
                return BadRequest("Invalid client request");
            }

            await _repository.UpdateCongesDispo(updateDto.Matricule, updateDto.CongesDispo);
            return NoContent();
        }
    }
}
