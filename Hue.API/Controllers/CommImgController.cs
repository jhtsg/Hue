using Microsoft.AspNetCore.Mvc;
using Hue.Data;
using Hue.Data.Utils;
using Hue.Common;
using static Hue.API.Controllers.AuthController;
using Hue.API.utils;
using Hue.Common.Commission;

namespace Hue.API.Controllers
{

    [ApiController]
    [Route("api/commImage")]
    public class CommImgController : ControllerBase {

        readonly CommissionImagesDAO dao;
        readonly ImageCache imgCache = new();

        public CommImgController() {
            dao = new(new EnvironmentKey("DB_URL", () => throw new InvalidOperationException("")).ToString());
        }

        #region CREATE
        [HttpPost]
        public async Task<IActionResult> Create(
                IFormFile file, 
                [FromForm] int commId,
                [FromForm] string? notes,
                [FromForm] int type
            ) {
            var session = await GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            if (file == null || file.Length == 0) { return BadRequest("No data!"); }
            if (file.Length > 5 * 1024 * 1024) { return BadRequest("File Too Large!"); }
            if (!ImageDownload.AcceptableMimeTypeExtensions.ContainsKey(file.ContentType)) {
                return BadRequest("Unacceptable type, must be an image!");
            }

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var fileBytes = memoryStream.ToArray(); // Convert to byte array

            var id = await dao.Create(session.Username, commId, notes, type, fileBytes, file.ContentType);
            //Actually we can just set this here
            
            var key = $"{session.Username}-{id}-COMMIMG";
            
            imgCache.AddToCache(key, new ImageDownload() {
                Data = fileBytes,
                Mime = file.ContentType,
                Filename = file.Name,
            });

            return Ok();
        }


        #endregion

        #region  READ

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery]int commId, [FromQuery] CommissionAssociatedImage.ImageType type) {
            var session = await GetSession(Request, Response);
            return session == null
                ? Unauthorized()
                : Ok(await dao.GetAll(session.Username, commId, type));
        }

        [HttpGet("{ID}")]
        public async Task<IActionResult> GetImage(int ID, [FromQuery] bool NoCache = false) {
            var session = await GetSession(Request, Response);
            if (session == null) return Unauthorized();


            var key = $"{session.Username}-{ID}-COMMIMG";
            var file = 
                imgCache.GetFromCache(key) ?? //Try getting it from the cache first. 
                imgCache.AddToCache(key, await dao.GetImage(session.Username, ID)); //Otherwise get it from the DB

            if (file == null || file.Data == null || file.Mime == null) return NotFound();

            Response.Headers.Append("Content-Disposition", "inline; filename=" + new string(file.FullFilename.Where(c=> c<128).ToArray()));
            Response.Headers.CacheControl = NoCache ? "no-cache" : "public, max-age=600";
            Response.Headers.Vary = "Cookie";
            Response.Headers.ETag = file.Hash;

            // Not modified
            return Request.Headers.IfNoneMatch == file.Hash ? StatusCode(304) : File(file.Data, file.Mime);
        }

        #endregion

        #region DELETE

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id) {
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
