using Microsoft.AspNetCore.Mvc;
using Hue.Data;
using Hue.Data.Utils;
using Igtampe.ChopoSessionManager;
using Hue.API.Requests.Auth;

namespace Hue.API.Controllers {

    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase {

        private static readonly string SESSION_COOKIE = "session";
        
        readonly UserDAO dao;

        public AuthController() {
            dao = new(new EnvironmentKey("DB_URL", () => throw new InvalidOperationException("")).ToString());
        }

        [HttpGet("me")]
        public async Task<IActionResult> Me() {
            var session = GetSession(Request,Response);
            return session == null ? Unauthorized() : Ok(await dao.GetUser(session.Username));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req) {
            if (!await dao.Authenticate(req.Username, req.Password)) {
                return BadRequest(new ProblemDetails() {
                    Status = 400,
                    Detail = "Incorrect username or password"
                });
            };

            AddSession(Response, SessionManager.Manager.LogIn(req.Username));

            return Ok();
        }

        [HttpGet("logout")]
        
        public IActionResult Logout() {
            RemoveSession(Response);
            return Ok();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request) {
            try { await dao.Register(request.Username, request.Password, request.RegistrationKey, request.IsArtist); }
            catch (ArgumentException e) { return BadRequest(new ProblemDetails() { 
                Status=400,
                Detail = e.Message
            }); }
            return Ok();
            
        }

        [HttpPut("password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePassRequest request) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }
            try { await dao.UpdatePassword(session.Username, request.OldPassword, request.NewPassword); }
            catch (ArgumentException e) {
                return BadRequest(new ProblemDetails() {
                    Status = 400,
                    Detail = e.Message
                });
            }

            return Ok();
        }

        public static Session? GetSession(HttpRequest request, HttpResponse response) {
            var sessionId = request.Cookies[SESSION_COOKIE];
            if (sessionId == null) { return null; }

            var session = SessionManager.Manager.FindSession(new Guid(sessionId));
            if (session == null) {
                RemoveSession(response);
                return null; 
            }
            return session;

        }

        private static void AddSession(HttpResponse response, Guid session) {
            response.Cookies.Append(SESSION_COOKIE, session.ToString(), new() {
                Expires = DateTime.UtcNow.AddDays(7),
                Secure = true,
                HttpOnly=true,
                SameSite = SameSiteMode.None
            });
        }

        private static void RemoveSession(HttpResponse response) {
            response.Cookies.Delete(SESSION_COOKIE, new() { 
                Secure=true,
                HttpOnly=true,
                SameSite=SameSiteMode.None
            });
        }
    }
}
