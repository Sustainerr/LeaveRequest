using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TelnetTeamClient.DTO;
using TelnetTeamClient.Interfaces;
using TelnetTeamClient.Models;

namespace TelnetTeamClient.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowSpecificOrigin")]
    public class CongesController : ControllerBase
    {
        private readonly ICongesRepository _repository;

        public CongesController(ICongesRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CongeDto>>> GetConges()
        {
            var conges = await _repository.GetConges();
            var congesDto = conges.Select(c => new CongeDto
            {
                Conge_Id = c.Conge_Id,  // Ensure Conge_Id is included here
                Date_Debut = c.Date_Debut,
                Date_Fin = c.Date_Fin,
                Statut = c.Statut,
                Type_Conge_Id = c.Type_Conge_Id,
                Matricule = c.Matricule
            });

            return Ok(congesDto);
        }

        [HttpGet("{congeId}")]
        public async Task<ActionResult<CongeDto>> GetConge(int congeId)
        {
            var conge = await _repository.GetConge(congeId);
            if (conge == null)
                return NotFound();

            var congeDto = new CongeDto
            {
                Conge_Id = conge.Conge_Id,  // Ensure Conge_Id is included here
                Date_Debut = conge.Date_Debut,
                Date_Fin = conge.Date_Fin,
                Statut = conge.Statut,
                Type_Conge_Id = conge.Type_Conge_Id,
                Matricule = conge.Matricule
            };

            return Ok(congeDto);
        }

        [HttpGet("matricule/{matricule}")]
        public async Task<ActionResult<IEnumerable<CongeDto>>> GetCongesByMatricule(int matricule)
        {
            var conges = await _repository.GetCongesByMatricule(matricule);
            var congesDto = conges.Select(c => new CongeDto
            {
                Conge_Id = c.Conge_Id,  // Ensure Conge_Id is included here
                Date_Debut = c.Date_Debut,
                Date_Fin = c.Date_Fin,
                Statut = c.Statut,
                Type_Conge_Id = c.Type_Conge_Id,
                Matricule = c.Matricule
            });

            return Ok(congesDto);
        }

        [HttpPost]
        public async Task<ActionResult> AddConge(CongeDto congeDto)
        {
            var conge = new Conge
            {
                Date_Debut = congeDto.Date_Debut,
                Date_Fin = congeDto.Date_Fin,
                Statut = congeDto.Statut,
                Type_Conge_Id = congeDto.Type_Conge_Id,
                Matricule = congeDto.Matricule
            };

            await _repository.AddConge(conge);
            return CreatedAtAction(nameof(GetConge), new { congeId = conge.Conge_Id }, congeDto);
        }

        [HttpPut("{congeId}")]
        public async Task<ActionResult> UpdateConge(int congeId, CongeDto congeDto)
        {
            if (congeId == 0)
                return BadRequest();

            var conge = new Conge
            {
                Conge_Id = congeId,
                Date_Debut = congeDto.Date_Debut,
                Date_Fin = congeDto.Date_Fin,
                Statut = congeDto.Statut,
                Type_Conge_Id = congeDto.Type_Conge_Id,
                Matricule = congeDto.Matricule
            };

            await _repository.UpdateConge(conge);
            return NoContent();
        }

        [HttpDelete("{congeId}")]
        public async Task<ActionResult> DeleteConge(int congeId)
        {
            await _repository.DeleteConge(congeId);
            return NoContent();
        }

        [HttpPatch("{congeId}/statut")]
        public async Task<ActionResult> UpdateCongeStatut(int congeId, [FromBody] string statut)
        {
            if (congeId == 0 || string.IsNullOrEmpty(statut))
                return BadRequest();

            await _repository.UpdateCongeStatut(congeId, statut);
            return NoContent();
        }
        [HttpPatch("{congeId}/dates")]
        public async Task<ActionResult> UpdateCongeDates(int congeId, [FromBody] UpdateCongeDatesDto updateCongeDatesDto)
        {
            if (congeId == 0 || updateCongeDatesDto == null)
                return BadRequest();

            await _repository.UpdateCongeDates(congeId, updateCongeDatesDto.Date_Debut, updateCongeDatesDto.Date_Fin);
            return NoContent();
        }

        [HttpGet("statut/{statut}")]
        public async Task<ActionResult<IEnumerable<CongeDto>>> GetCongesByStatut(string statut)
        {
            var conges = await _repository.GetCongesByStatut(statut);
            var congesDto = conges.Select(c => new CongeDto
            {
                Conge_Id = c.Conge_Id,
                Date_Debut = c.Date_Debut,
                Date_Fin = c.Date_Fin,
                Statut = c.Statut,
                Type_Conge_Id = c.Type_Conge_Id,
                Matricule = c.Matricule
            });

            return Ok(congesDto);
        }
    }
}
