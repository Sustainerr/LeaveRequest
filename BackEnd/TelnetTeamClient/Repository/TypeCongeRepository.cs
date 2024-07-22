using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using TelnetTeamClient.Data;
using TelnetTeamClient.Interfaces;
using TelnetTeamClient.Models;

namespace TelnetTeamClient.Repository
{
    public class TypeCongeRepository : ITypeCongeRepository
    {
        private readonly DataContext _context;

        public TypeCongeRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TypeConge>> GetAllAsync()
        {
            return await _context.TypesConge.ToListAsync();
        }

        public async Task<TypeConge> GetByIdAsync(int id)
        {
            return await _context.TypesConge.FindAsync(id);
        }

        public async Task AddAsync(TypeConge typeConge)
        {
            await _context.TypesConge.AddAsync(typeConge);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(TypeConge typeConge)
        {
            _context.TypesConge.Update(typeConge);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var typeConge = await _context.TypesConge.FindAsync(id);
            if (typeConge != null)
            {
                _context.TypesConge.Remove(typeConge);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<TypeConge>> GetByRoleAsync(string role)
        {
            return _context.TypesConge
                           .AsEnumerable()
                           .Where(tc => tc.role.Equals(role, StringComparison.OrdinalIgnoreCase));
        }

    }
}
