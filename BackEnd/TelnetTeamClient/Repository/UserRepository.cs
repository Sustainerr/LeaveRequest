using TelnetTeamClient.Models;
using TelnetTeamClient.Interfaces;
using TelnetTeamClient.Data;
using Microsoft.EntityFrameworkCore;


namespace TelnetTeamClient.Repository
{
    public class UserRepository : Iusers
    {
        private readonly DataContext _context;
        public UserRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<User> GetUserById(int id)
        {

            return await _context.Users.FindAsync(id);

        }

        public async Task DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }

        }
        public async Task <User> GetUserByIdUsernameAndPassword(string username, string password)
        {
            
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Username == username && u.PasswordHash == password);
        }
        public async Task<User> AddUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User> GetUserByUsernameAndPassword(string username, string password)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username && u.PasswordHash == password);
        }

        public async Task<User> UpdateUser (User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return user;
        }
    }

}
