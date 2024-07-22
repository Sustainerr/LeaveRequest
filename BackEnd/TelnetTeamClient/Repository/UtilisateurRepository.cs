using System.Linq;
using TelnetTeamClient.Data;
using TelnetTeamClient.Interfaces;
using TelnetTeamClient.Models;
using Microsoft.EntityFrameworkCore;
using TelnetTeamClient.DTO;

namespace TelnetTeamClient.Repository
{
    public class UtilisateurRepository : IUtilisateurRepository
    {
        private readonly DataContext _context;

        public UtilisateurRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Utilisateur>> GetUtilisateurs()
        {
            return await _context.Utilisateurs.ToListAsync();
        }

        public async Task<UtilisateurDetailsDto> GetUtilisateur(int matricule)
        {
            var utilisateur = await _context.Utilisateurs
                .Where(u => u.Matricule == matricule)
                .Select(u => new UtilisateurDetailsDto
                {
                    Matricule = u.Matricule,
                    Nom = u.Nom,
                    Prenom = u.Prenom,
                    Role = u.Role,
                    Groupe_Id = u.Groupe_Id,
                    CongesDispo = u.CongesDispo,
                    AutorisationDispo = u.AutorisationDispo
                })
                .FirstOrDefaultAsync();

            return utilisateur;
        }

        public async Task<Utilisateur> GetUtilisateurByMatriculeAndPassword(int matricule, string password)
        {
            return await _context.Utilisateurs.FirstOrDefaultAsync(u => u.Matricule == matricule && u.MotDePasse == password);
        }

        public async Task AddUtilisateur(Utilisateur utilisateur)
        {
            await _context.Utilisateurs.AddAsync(utilisateur);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateUtilisateur(Utilisateur utilisateur)
        {
            _context.Utilisateurs.Update(utilisateur);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUtilisateur(int matricule)
        {
            var utilisateur = await _context.Utilisateurs.FindAsync(matricule);
            if (utilisateur != null)
            {
                _context.Utilisateurs.Remove(utilisateur);
                await _context.SaveChangesAsync();
            }
        }

        // Implementation of the new method
        public async Task<IEnumerable<Utilisateur>> GetUtilisateursByGroupeId(int groupeId)
        {
            return await _context.Utilisateurs
                .Where(u => u.Groupe_Id == groupeId)
                .ToListAsync();
        }

        public async Task UpdateCongesDispo(int matricule, int congesDispo)
        {
            var utilisateur = await _context.Utilisateurs.FindAsync(matricule);
            if (utilisateur != null)
            {
                utilisateur.CongesDispo = congesDispo;
                await _context.SaveChangesAsync();
            }
        }
    }
}
