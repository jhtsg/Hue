using Microsoft.AspNetCore.Mvc;

namespace Hue.API.Controllers {

    public class PongResponse {
        public DateTime StartupTime { get; set; }
        public DateTime PongTime { get; set; }
        public string Pong => "pong";
    }

    [ApiController]
    [Route("api/ping")]
    public class PingPongController : ControllerBase {

        public static DateTime StartupTime { get; set; } = DateTime.UtcNow;
        
        [HttpGet]
        public IActionResult Pong() => Ok(new PongResponse() { 
            PongTime = DateTime.UtcNow,
            StartupTime = StartupTime
        });
        
    }
}
