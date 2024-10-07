using Microsoft.AspNetCore.Mvc;

namespace Hue.API.Controllers {

    [ApiController]
    [Route("api/ping")]
    public class PingPongController : ControllerBase {

        public static DateTime StartupTime { get; set; } = DateTime.UtcNow;

        public class PongResponse { 
            public DateTime startupTime { get; set; }
            public DateTime currentTime { get; set; }
            public string pong => "pong";
        }

        [HttpGet]
        public IActionResult Pong() => Ok(new PongResponse() { 
            currentTime = DateTime.UtcNow,
            startupTime = StartupTime
        });
        
    }
}
