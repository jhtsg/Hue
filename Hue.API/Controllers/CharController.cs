using Microsoft.AspNetCore.Mvc;
using Hue.Data;
using Hue.Data.Utils;
using Hue.Common;
using static Hue.API.Controllers.AuthController;

namespace Hue.API.Controllers {

    [ApiController]
    [Route("api/char")]
    public class CharController : ControllerBase {

        readonly CharacterDAO dao;

        public CharController() {
            dao = new(new EnvironmentKey("DB_URL", () => throw new InvalidOperationException("")).ToString());
        }

        #region CREATE
        [HttpPost]
        public async Task<IActionResult> Create(Character character) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }
            await dao.Create(session.Username, character);
            return Created();
        }

        [HttpPost("category")]
        public async Task<IActionResult> CreateCategory(CharacterCategory category) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }
            await dao.CreateCategory(session.Username, category);
            return Created();
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

            var file = await dao.GetImage(session.Username, ID);
            if(file== null || file.Data==null || file.Mime==null) return NotFound(); 

            Response.Headers.Append("Content-Disposition", "inline; filename=" + file.FullFilename);
            return File(file.Data,file.Mime);
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
            return Ok();
        }

        #endregion



    }
}
