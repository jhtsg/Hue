using Microsoft.AspNetCore.Mvc;
using Hue.Data;
using Hue.Data.Utils;
using Hue.Common;
using static Hue.API.Controllers.AuthController;
using Hue.Common.Character;
using Hue.API.utils;

namespace Hue.API.Controllers
{

    [ApiController]
    [Route("api/char")]
    public class CharController : ControllerBase {

        readonly CharacterDAO dao;
        readonly ImageCache imgCache = new();

        public CharController() {
            dao = new(new EnvironmentKey("DB_URL", () => throw new InvalidOperationException("")).ToString());
        }

        #region CREATE
        [HttpPost]
        public async Task<IActionResult> Create(Character character) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }
            var id = await dao.Create(session.Username, character);
            return Created("api/char/" + id, await dao.Get(session.Username, id));
        }

        [HttpPost("category")]
        public async Task<IActionResult> CreateCategory(CharacterCategory category) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }
            var id = await dao.CreateCategory(session.Username, category);
            return Created("api/char/category/" + id, await dao.GetCategory(session.Username, id));
        }

        #endregion

        #region  READ

        [HttpGet]
        public async Task<IActionResult> GetAll() {
            var session = GetSession(Request, Response);
            return session == null
                ? Unauthorized()
                : Ok(await dao.GetAll(session.Username));
        }

        [HttpGet("{ID}")]
        public async Task<IActionResult> Get(int ID) {
            var session = GetSession(Request, Response);
            return session == null
                ? Unauthorized()
                : Ok(await dao.Get(session.Username,ID));
        }
        
        [HttpGet("category")]
        public async Task<IActionResult> GetAllCategories() {
            var session = GetSession(Request, Response);
            return session == null
                ? Unauthorized()
                : Ok(await dao.GetAllCategories(session.Username));
        }

        [HttpGet("category/{ID}")]
        public async Task<IActionResult> GetCategory(int ID) {
            var session = GetSession(Request, Response);
            return session == null
                ? Unauthorized()
                : Ok(await dao.GetCategory(session.Username, ID));
        }


        [HttpGet("{ID}/image")]
        public async Task<IActionResult> GetImage(int ID) {
            var session = GetSession(Request, Response);
            if (session == null) return Unauthorized();

            var key = $"{session.Username}-{ID}-CHARACTER";
            var file =
                imgCache.GetFromCache(key) ?? //Try getting it from the cache first. 
                imgCache.AddToCache(key, await dao.GetImage(session.Username, ID)); //Otherwise get it from the DB

            if (file== null || file.Data==null || file.Mime==null) return NotFound();

            Response.Headers.Append("Content-Disposition", "inline; filename=" + new string(file.FullFilename.Where(c => c < 128).ToArray()));
            Response.Headers.CacheControl = "public, max-age=31536000";
            Response.Headers.Vary = "Cookie";
            Response.Headers.ETag = file.Hash;

            // Not modified
            return Request.Headers.IfNoneMatch == file.Hash ? StatusCode(304) : File(file.Data, file.Mime);
        }

        #endregion

        #region UPDATE

        [HttpPut]
        public async Task<IActionResult> Update(Character character) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }
            await dao.Update(session.Username, character);
            return Ok();
        }

        [HttpPut("primary")]
        public async Task<IActionResult> SetPrimary(Character character) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }
            await dao.UpdatePrimary(session.Username, character);
            return Ok();
        }


        [HttpPut("category")]
        public async Task<IActionResult> UpdateCategory(CharacterCategory category) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }
            await dao.UpdateCategory(session.Username, category);
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
            var key = $"{session.Username}-{ID}-CHARACTER";
            imgCache.AddToCache(key, new ImageDownload() {
                Data = fileBytes,
                Mime = file.ContentType,
                Filename = file.Name,
            });

            return Ok();
        }

        #endregion



    }
}
