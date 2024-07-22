using TelnetTeamClient.Models;

namespace TelnetTeamClient.Interfaces
{
    public interface IAutorisationsRepository
    {
        Task<IEnumerable<Autorisation>> GetAutorisations();
        Task<Autorisation> GetAutorisation(int autorisationId);
        Task AddAutorisation(Autorisation autorisation);
        Task UpdateAutorisation(Autorisation autorisation);
        Task DeleteAutorisation(int autorisationId);
    }
}
