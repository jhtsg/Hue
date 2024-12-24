using Hue.Data;
using Hue.Data.Utils;
using Microsoft.AspNetCore.Mvc;

namespace Hue.API.Controllers {

    public class PongResponse {
        public DateTime StartupTime { get; set; }
        public DateTime PongTime { get; set; }
        public PingPongDao.DbPingPong? DbPingPong { get; set; }
        public string Pong => "pong";
    }

    [ApiController]
    [Route("api/ping")]
    public class PingPongController : ControllerBase {

        public static DateTime StartupTime { get; set; } = DateTime.UtcNow;
        PingPongDao dao;

        public PingPongController() {
            dao = new(new EnvironmentKey("DB_URL", () => throw new InvalidOperationException("")).ToString());
        }

        [HttpGet]
        public async Task<IActionResult> Pong() => Ok(new PongResponse() { 
            PongTime = DateTime.UtcNow,
            StartupTime = StartupTime,
            DbPingPong = await dao.PingPong()
        });
        
    }
}
