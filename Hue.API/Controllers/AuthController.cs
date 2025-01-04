using Microsoft.AspNetCore.Mvc;
using Hue.Data;
using Hue.Data.Utils;
using Hue.API.Requests.Auth;
using Hue.API.utils;
using Hue.Common;
using System;

namespace Hue.API.Controllers {

    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase {

        private static readonly string SESSION_COOKIE = "session";
        private static readonly bool SECURE = !(new OptionalEnvironmentKey("NO_SECURE").ToString()?.ToLower().Equals("true") ?? false);
        
        static readonly string DbUrl = new EnvironmentKey("DB_URL", () => throw new InvalidOperationException("")).ToString();
        readonly UserDAO dao;
        static readonly SessionManager manager = new(DbUrl);

        public AuthController() {
            dao = new(DbUrl);
        }

        [HttpGet("me")]
        public async Task<IActionResult> Me() {
            var session = await GetSession(Request,Response);
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

            AddSession(Response, (await manager.LogIn(req.Username)).Id);

            return Ok();
        }

        [HttpGet("logout")]
        
        public async Task<IActionResult> Logout() {
            var s = await GetSession(Request, Response);
            if (s != null) {await manager.LogOut(s.Id);}
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
            var session = await GetSession(Request, Response);
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

        public static async Task<Session?> GetSession(HttpRequest request, HttpResponse response) {
            var sessionId = request.Cookies[SESSION_COOKIE];
            if (sessionId == null) { return null; }

            var session = await manager.FindSession(new Guid(sessionId));
            if (session == null) {
                RemoveSession(response);
                return null; 
            }
            return session;

        }

        private static void AddSession(HttpResponse response, Guid session) {
            response.Cookies.Append(SESSION_COOKIE, session.ToString(), new() {
                Expires = DateTime.UtcNow.AddDays(7),
                Secure = SECURE,
                HttpOnly=true,
                SameSite = SECURE ? SameSiteMode.None :  SameSiteMode.Lax
            });
        }

        private static void RemoveSession(HttpResponse response) {
            response.Cookies.Delete(SESSION_COOKIE, new() { 
                Secure= SECURE,
                HttpOnly=true,
                SameSite= SECURE ? SameSiteMode.None : SameSiteMode.Lax
            });
        }
    }
}
