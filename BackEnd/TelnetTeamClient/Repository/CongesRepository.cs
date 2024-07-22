using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TelnetTeamClient.Models;
using TelnetTeamClient.Interfaces;
using TelnetTeamClient.Data;

namespace TelnetTeamClient.Repository
{
    public class CongesRepository : ICongesRepository
    {
        private readonly DataContext _context;

        public CongesRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Conge>> GetConges()
        {
            return await _context.Conges.ToListAsync();
        }

        public async Task<Conge> GetConge(int congeId)
        {
            return await _context.Conges.FindAsync(congeId);
        }

        public async Task AddConge(Conge conge)
        {
            _context.Conges.Add(conge);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateConge(Conge conge)
        {
            _context.Entry(conge).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteConge(int congeId)
        {
            var conge = await _context.Conges.FindAsync(congeId);
            if (conge != null)
            {
                _context.Conges.Remove(conge);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Conge>> GetCongesByMatricule(int matricule)
        {
            return await _context.Conges.Where(c => c.Matricule == matricule).ToListAsync();
        }
        public async Task UpdateCongeStatut(int congeId, string statut)
        {
            var conge = await _context.Conges.FindAsync(congeId);
            if (conge != null)
            {
                conge.Statut = statut;
                _context.Entry(conge).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
        }
        public async Task UpdateCongeDates(int congeId, DateTime dateDebut, DateTime dateFin)
        {
            var conge = await _context.Conges.FindAsync(congeId);
            if (conge != null)
            {
                conge.Date_Debut = dateDebut;
                conge.Date_Fin = dateFin;
                _context.Entry(conge).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Conge>> GetCongesByStatut(string statut)
        {
            return await _context.Conges.Where(c => c.Statut == statut).ToListAsync();
        }

    }
}
