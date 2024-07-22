using TelnetTeamClient.Models;

namespace TelnetTeamClient.Interfaces
{
    public interface ICongesRepository
    {
        Task<IEnumerable<Conge>> GetConges();
        Task<Conge> GetConge(int congeId);
        Task AddConge(Conge conge);
        Task UpdateConge(Conge conge);
        Task DeleteConge(int congeId);
        Task<IEnumerable<Conge>> GetCongesByMatricule(int matricule);
        Task UpdateCongeStatut(int congeId, string statut);
        Task UpdateCongeDates(int congeId, DateTime dateDebut, DateTime dateFin);
        Task<IEnumerable<Conge>> GetCongesByStatut(string statut);  
    }
}
