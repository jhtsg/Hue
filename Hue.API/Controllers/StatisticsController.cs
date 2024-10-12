using Hue.Data.Utils;
using Hue.Data;
using Microsoft.AspNetCore.Mvc;
using static Hue.API.Controllers.AuthController;

namespace Hue.API.Controllers {

    [ApiController]
    [Route("api/stats")]
    public class StatisticsController : ControllerBase {

        readonly StatisticsDAO dao;

        public StatisticsController() {
            dao = new(new EnvironmentKey("DB_URL", () => throw new InvalidOperationException("")).ToString());
        }

        [HttpGet("glance")]
        public async Task<IActionResult> GetAllCount([FromQuery] int? year) {
            var session = GetSession(Request, Response);
            return session == null
                ? Unauthorized()
                : Ok(year == null ? await dao.GetOverallAtAGlance(session.Username) 
                                : await dao.GetYearAtAGlance(session.Username,year.Value));
        }

        [HttpGet("priceCat/{year}")]
        public async Task<IActionResult> PriceCat(int year) {
            var session = GetSession(Request, Response);
            return session == null
                ? Unauthorized()
                : Ok(await dao.GetMonthlyPriceCat(session.Username, year));
        }
        
        [HttpGet("spending/{year}")]
        public async Task<IActionResult> Spending(int year) {
            var session = GetSession(Request, Response);
            return session == null
                ? Unauthorized()
                : Ok(await dao.GetMonthlySpend(session.Username, year));
        }

        [HttpGet("status/{year}")]
        public async Task<IActionResult> Status(int year) {
            var session = GetSession(Request, Response);
            return session == null
                ? Unauthorized()
                : Ok(await dao.GetMonthlyStatus(session.Username, year));
        }

        [HttpGet("artist")]
        public async Task<IActionResult> ArtistStatistics([FromQuery] int? year) {
            var session = GetSession(Request, Response);
            return session == null
                ? Unauthorized()
                : Ok(year == null ? await dao.GetOverallArtistStatistics(session.Username)
                                : await dao.GetYearlyArtistStatistics(session.Username, year.Value));
        }

        [HttpGet("artist/{id}")]
        public async Task<IActionResult> StatisticsForArtist(int id, [FromQuery] int? year) {
            var session = GetSession(Request, Response);
            return session == null
                ? Unauthorized()
                : Ok(year == null ? await dao.GetOverallStatisticForArtist(session.Username, id)
                                : await dao.GetYearlyStatisticForArtist(session.Username, id, year.Value));
        }

        [HttpGet("characters")]
        public async Task<IActionResult> CharacterStatistics([FromQuery] int? year) {
            var session = GetSession(Request, Response);
            return session == null
                ? Unauthorized()
                : Ok(year == null ? await dao.GetOverallCharacterStatistics(session.Username)
                                : await dao.GetYearlyCharacterStatistics(session.Username, year.Value));
        }

        [HttpGet("characters/{id}")]
        public async Task<IActionResult> StatisticsForCharacter(int id, [FromQuery] int? year) {
            var session = GetSession(Request, Response);
            return session == null
                ? Unauthorized()
                : Ok(year == null ? await dao.GetOverallStatisticForCharacter(session.Username, id)
                                : await dao.GetYearlyStatisticForCharacter(session.Username, id, year.Value));
        }

        [HttpGet("tag")]
        public async Task<IActionResult> TagStatistics([FromQuery] int? year) {
            var session = GetSession(Request, Response);
            return session == null
                ? Unauthorized()
                : Ok(year == null ? await dao.GetOverallTagStatistics(session.Username)
                                : await dao.GetYearlyTagStatistics(session.Username, year.Value));
        }

        [HttpGet("tag/{id}")]
        public async Task<IActionResult> StatisticsForTag(int id, [FromQuery] int? year) {

            var session = GetSession(Request, Response);
            return session == null
                ? Unauthorized()
                : Ok(year == null ? await dao.GetOverallStatisticForTag(session.Username, id)
                                : await dao.GetYearlyStatisticForTag(session.Username, id, year.Value));
        }


    }
}
