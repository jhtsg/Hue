using Microsoft.AspNetCore.Mvc;
using Hue.Data;
using Hue.Data.Utils;
using Hue.Common;
using static Hue.API.Controllers.AuthController;
using Hue.Common.Artist;
using Hue.API.utils;
using Microsoft.AspNetCore.DataProtection.KeyManagement;

namespace Hue.API.Controllers
{

    [ApiController]
    [Route("api/artist")]
    public class ArtistController : ControllerBase {

        readonly ArtistDAO dao;
        readonly ImageCache imgCache = new();

        public ArtistController() {
            dao = new(new EnvironmentKey("DB_URL", () => throw new InvalidOperationException("")).ToString());
        }

        #region CREATE
        [HttpPost]
        public async Task<IActionResult> Create(Artist artist) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }
            var id = await dao.Create(session.Username, artist);
            return Created("api/artist/" + id,await dao.Get(session.Username,id));
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

        [HttpGet("{ID}/image")]
        public async Task<IActionResult> GetImage(int ID) {
            var session = GetSession(Request, Response);
            if (session == null) return Unauthorized();


            var key = $"{session.Username}-{ID}-ARTIST";
            var file = 
                imgCache.GetFromCache(key) ?? //Try getting it from the cache first. 
                imgCache.AddToCache(key, await dao.GetImage(session.Username, ID)); //Otherwise get it from the DB

            if (file == null || file.Data == null || file.Mime == null) return NotFound();

            Response.Headers.Append("Content-Disposition", "inline; filename=" + new string(file.FullFilename.Where(c=> c<128).ToArray()));
            return File(file.Data,file.Mime);
        }

        #endregion

        #region UPDATE

        [HttpPut]
        public async Task<IActionResult> Update(Artist artist) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }
            await dao.Update(session.Username, artist);
            return Ok();
        }

        [HttpPut("{ID}/image")]
        public async Task<IActionResult> UpdateImage(int ID, [FromForm] IFormFile file) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            if (file == null || file.Length == 0) { return BadRequest("No data!"); }
            if (file.Length > 5 * 1024 * 1024) { return BadRequest("File "); }
            if (!ImageDownload.AcceptableMimeTypeExtensions.ContainsKey(file.ContentType)) {
                return BadRequest("Unacceptable type, must be an image!");
            }

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var fileBytes = memoryStream.ToArray(); // Convert to byte array

            await dao.UpdateImage(session.Username,ID, fileBytes, file.ContentType);
            //Actually we can just set this here
            var key = $"{session.Username}-{ID}-ARTIST";
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
