using Microsoft.AspNetCore.Mvc;
using Hue.Data;
using Hue.Data.Utils;
using Hue.Common;
using static Hue.API.Controllers.AuthController;
using Hue.Common.Commission;
using Hue.API.utils;

namespace Hue.API.Controllers
{

    [ApiController]
    [Route("api/comm")]
    public class CommController : ControllerBase {

        readonly CommissionDAO dao;
        readonly ImageCache imgCache = new();

        public CommController() {
            dao = new(new EnvironmentKey("DB_URL", () => throw new InvalidOperationException("")).ToString());
        }

        #region CREATE
        [HttpPost]
        public async Task<IActionResult> Create(Commission comm) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }
            var id = await dao.Create(session.Username, comm);
            return Created("api/comm/" + id, await dao.Get(session.Username, id));
        }

        [HttpPost("tag")]
        public async Task<IActionResult> CreateTag(CommissionTag commTag) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }
            var id = await dao.CreateTag(session.Username, commTag);
            return Created("api/comm/tag/" + id, await dao.GetTag(session.Username, id));
        }

        #endregion

        #region READ

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] CommissionFilterOptions filter
            ) {

            var session = GetSession(Request, Response);
            return session == null
                ? Unauthorized()
                : Ok(await dao.GetAll(session.Username,filter));
        }

        [HttpGet("Count")]
        public async Task<IActionResult> GetAllCount(
            [FromQuery] CommissionFilterOptions filter
            ) {

            var session = GetSession(Request, Response);
            return session == null
                ? Unauthorized()
                : Ok(new Dictionary<string, int>() { { "count", await dao.GetCount(session.Username, filter) } });
        }

        [HttpGet("{ID}")]
        public async Task<IActionResult> Get(int ID) {
            var session = GetSession(Request, Response);
            return session == null
                ? Unauthorized()
                : Ok(await dao.Get(session.Username,ID));
        }

        [HttpGet("years")]
        public async Task<IActionResult> GetYears() {
            var session = GetSession(Request, Response);
            return session == null
                ? Unauthorized()
                : Ok(await dao.GetYears(session.Username));
        }

        [HttpGet("tag")]
        public async Task<IActionResult> GetAllTags() {
            var session = GetSession(Request, Response);
            return session == null
                ? Unauthorized()
                : Ok(await dao.GetAllTags(session.Username));
        }

        [HttpGet("tag/{ID}")]
        public async Task<IActionResult> GetTag(int ID) {
            var session = GetSession(Request, Response);
            return session == null
                ? Unauthorized()
                : Ok(await dao.GetTag(session.Username, ID));
        }


        [HttpGet("{ID}/image")]
        public async Task<IActionResult> GetImage(int ID) {
            var session = GetSession(Request, Response);
            if (session == null) return Unauthorized();

            var key = $"{session.Username}-{ID}-COMMISSION";
            var file =
                imgCache.GetFromCache(key) ?? //Try getting it from the cache first. 
                imgCache.AddToCache(key, await dao.GetImage(session.Username, ID)); //Otherwise get it from the DB
            if (file== null || file.Data==null || file.Mime==null) return NotFound(); 

            Response.Headers.Append("Content-Disposition", "inline; filename=" + file.FullFilename);
            return File(file.Data,file.Mime);
        }

        #endregion

        #region UPDATE

        [HttpPut]
        public async Task<IActionResult> Update(Commission comm) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }
            await dao.Update(session.Username, comm);
            return Ok();
        }

        [HttpPut("tag")]
        public async Task<IActionResult> UpdateCategory(CommissionTag tag) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }
            await dao.UpdateTag(session.Username, tag);
            return Ok();
        }

        [HttpPut("{ID}/image")]
        public async Task<IActionResult> UpdateImage(int ID, [FromForm] IFormFile file) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            if (file == null || file.Length == 0) { return BadRequest("No data!"); }
            if (!ImageDownload.AcceptableMimeTypeExtensions.ContainsKey(file.ContentType)) {
                return BadRequest("Unacceptable type, must be an image!");
            }

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var fileBytes = memoryStream.ToArray(); // Convert to byte array

            await dao.UpdateImage(session.Username,ID, fileBytes, file.ContentType);
            var key = $"{session.Username}-{ID}-COMMISSION";
            imgCache.AddToCache(key, new ImageDownload() {
                Data = fileBytes,
                Mime = file.ContentType,
                Filename = file.Name,
            });

            return Ok();
        }

        #endregion

        #region DELETE

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCommission(int id) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }
            await dao.DeleteCommission(session.Username, id);
            return Ok();
        }

        [HttpDelete("tag/{id}")]
        public async Task<IActionResult> DeleteTag(int id) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }
            await dao.DeleteTag(session.Username, id);
            return Ok();
        }

        #endregion

    }
}
