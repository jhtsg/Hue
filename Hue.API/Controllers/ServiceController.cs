using Microsoft.AspNetCore.Mvc;
using Hue.Data;
using Hue.Data.Utils;
using static Hue.API.Controllers.AuthController;
using Hue.Common.Artist;

namespace Hue.API.Controllers
{

    [ApiController]
    [Route("api/service")]
    public class ServiceController : ControllerBase {

        readonly ServicesDAO dao;

        public ServiceController() {
            dao = new(new EnvironmentKey("DB_URL", () => throw new InvalidOperationException("")).ToString());
        }

        #region CREATE
        [HttpPost]
        public async Task<IActionResult> Create(Service service) {
            var session = await GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }
            var s = await dao.Create(session.Username, service);
            return s == null ? throw new InvalidOperationException("This really should never happen") : (IActionResult)Created("api/artist/" + s.Id,s);
        }

        #endregion

        #region  READ

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery]int? artistId = null, [FromQuery] int? commType = null, [FromQuery] bool? noRetired = null) {
            var session = await GetSession(Request, Response);
            return session == null
                ? Unauthorized()
                : Ok(await dao.GetAll(session.Username,artistId,commType, noRetired));
        }

        [HttpGet("{ID}")]
        public async Task<IActionResult> Get(int ID) {
            var session = await GetSession(Request, Response);
            return session == null
                ? Unauthorized()
                : Ok(await dao.Get(session.Username,ID));
        }

     

        #endregion

        #region UPDATE

        [HttpPut]
        public async Task<IActionResult> Update(Service service) {
            var session = await GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }
            await dao.Update(session.Username, service);
            return Ok();
        }

        #endregion

        #region

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArtist(int id) {
            var session = await GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }
            try { await dao.Delete(session.Username, id); } catch (InvalidOperationException e){
                return BadRequest(e.Message);
            }
            return Ok();
        }

        #endregion



    }
}
