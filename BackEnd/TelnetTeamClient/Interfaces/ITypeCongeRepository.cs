using System.Collections.Generic;
using System.Threading.Tasks;
using TelnetTeamClient.Models;

namespace TelnetTeamClient.Interfaces
{
    public interface ITypeCongeRepository
    {
        Task<IEnumerable<TypeConge>> GetAllAsync();
        Task<TypeConge> GetByIdAsync(int id);
        Task AddAsync(TypeConge typeConge);
        Task UpdateAsync(TypeConge typeConge);
        Task DeleteAsync(int id);
        Task<IEnumerable<TypeConge>> GetByRoleAsync(string role);

    }
}
