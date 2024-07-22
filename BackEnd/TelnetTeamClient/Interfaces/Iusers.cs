using TelnetTeamClient.Models;
namespace TelnetTeamClient.Interfaces
{
    public interface Iusers
    {
        Task<User> GetUserById(int id);
        Task<User> AddUser(User user);
        Task<User> UpdateUser(User user);
        Task DeleteUser(int id);
        Task<User> GetUserByUsernameAndPassword(string username, string password);
        Task <User> GetUserByIdUsernameAndPassword(string username, string password);
    }
}
