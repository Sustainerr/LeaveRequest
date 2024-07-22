using TelnetTeamClient.Data;
using TelnetTeamClient.Interfaces;
using TelnetTeamClient.Models;
using Microsoft.EntityFrameworkCore;

namespace TelnetTeamClient.Repository
{
    public class AutorisationsRepository : IAutorisationsRepository
    {
        private readonly DataContext _context;

        public AutorisationsRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Autorisation>> GetAutorisations()
        {
            return await _context.Autorisations.ToListAsync();
        }

        public async Task<Autorisation> GetAutorisation(int autorisationId)
        {
            return await _context.Autorisations.FindAsync(autorisationId);
        }

        public async Task AddAutorisation(Autorisation autorisation)
        {
            await _context.Autorisations.AddAsync(autorisation);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAutorisation(Autorisation autorisation)
        {
            _context.Autorisations.Update(autorisation);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAutorisation(int autorisationId)
        {
            var autorisation = await _context.Autorisations.FindAsync(autorisationId);
            if (autorisation != null)
            {
                _context.Autorisations.Remove(autorisation);
                await _context.SaveChangesAsync();
            }
        }
    }
}
