using TelnetTeamClient.DTO;
using TelnetTeamClient.Models;

namespace TelnetTeamClient.Interfaces
{
    public interface IUtilisateurRepository
    {
        Task<IEnumerable<Utilisateur>> GetUtilisateurs();
        Task<UtilisateurDetailsDto> GetUtilisateur(int matricule);
        Task<Utilisateur> GetUtilisateurByMatriculeAndPassword(int matricule, string passwordHash);
        Task AddUtilisateur(Utilisateur utilisateur);
        Task UpdateUtilisateur(Utilisateur utilisateur);
        Task DeleteUtilisateur(int matricule);
        Task<IEnumerable<Utilisateur>> GetUtilisateursByGroupeId(int groupeId);

        Task UpdateCongesDispo(int matricule, int congesDispo);
    }
}
