using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using TelnetTeamClient.Interfaces;
using TelnetTeamClient.Models;


namespace TelnetTeamClient.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowSpecificOrigin")] // Apply CORS policy at the controller level
    public class UserController : ControllerBase
    {
        private readonly Iusers _userRepository;
        private readonly IConfiguration _configuration;
        public UserController(Iusers userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _userRepository.GetUserById(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            var createdUser = await _userRepository.AddUser(user);
            return CreatedAtAction("GetUser", new { id = createdUser.UserId }, createdUser);

        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(User login)
        {
            // Validate user input
            if (login == null || string.IsNullOrEmpty(login.Username) || string.IsNullOrEmpty(login.PasswordHash))
            {
                return BadRequest("Invalid client request");
            }

            var user = await _userRepository.GetUserByUsernameAndPassword(login.Username, login.PasswordHash);

            if (user == null)
            {
                return Unauthorized();
            }

            // Use the configured security key from appsettings.json
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
            var signingKey = new SymmetricSecurityKey(key);

            // Generate JWT token
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Name, user.Username)
        }),
                Expires = DateTime.UtcNow.AddHours(1), // Token expiration time (1 hour from now)
                SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"]
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new { Token = tokenString });
        }



        [HttpGet("validate")]
        public async Task<IActionResult> ValidateUser([FromQuery] string username, [FromQuery] string password)
        {
            // Check if a user exists with the provided ID, username, and password
            var user = await _userRepository.GetUserByIdUsernameAndPassword( username, password);
            if (user != null)
            {
                return Ok(user); // User exists
            }
            else
            {
                return NotFound(); // User does not exist
            }
        }
    }
}
