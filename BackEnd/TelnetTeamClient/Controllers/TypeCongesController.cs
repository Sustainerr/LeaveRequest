using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using TelnetTeamClient.DTO;
using TelnetTeamClient.Interfaces;
using TelnetTeamClient.Models;

namespace TelnetTeamClient.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TypeCongesController : ControllerBase
    {
        private readonly ITypeCongeRepository _repository;

        public TypeCongesController(ITypeCongeRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TypeConge>>> GetAll()
        {
            var typeConges = await _repository.GetAllAsync();
            return Ok(typeConges);
        }

        [HttpGet("byRole/{role}")]
        public async Task<ActionResult<IEnumerable<TypeConge>>> GetByRole(string role)
        {
            var typeConges = await _repository.GetByRoleAsync(role);
            if (typeConges == null || !typeConges.Any())
            {
                return NotFound();
            }
            return Ok(typeConges);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<TypeConge>> GetById(int id)
        {
            var typeConge = await _repository.GetByIdAsync(id);
            if (typeConge == null)
            {
                return NotFound();
            }
            return Ok(typeConge);
        }

        [HttpPost]
        public async Task<ActionResult> Create(TypeCongeDto typeCongeDto)
        {
            var typeConge = new TypeConge
            {
                Type = typeCongeDto.Type,
                role = typeCongeDto.Role
            };

            await _repository.AddAsync(typeConge);
            return CreatedAtAction(nameof(GetById), new { id = typeConge.Type_Conge_Id }, typeConge);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, TypeCongeDto typeCongeDto)
        {
            var existingTypeConge = await _repository.GetByIdAsync(id);
            if (existingTypeConge == null)
            {
                return NotFound();
            }

            existingTypeConge.Type = typeCongeDto.Type;
            existingTypeConge.role = typeCongeDto.Role;

            await _repository.UpdateAsync(existingTypeConge);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }
}
