using Hue.Common;
using Hue.Data.Utils;
using static Hue.Data.Utils.AdoTemplate;
using static Hue.Data.Utils.SqlBuilder;
using static Hue.Data.Utils.Constants;
using static Hue.Data.Utils.OwnerChecker;
using Hue.Common.Artist;

namespace Hue.Data
{
    public class ArtistDAO(string connectionString) {
        readonly AdoTemplate adoTemplate = new(connectionString);

        #region CREATE
        public async Task<int> Create(string username, Artist artist) {

            var sql = InsertSql(
                columns : [ARTIST_NM, ARTIST_SOCIAL_TX, ARTIST_COMM_SHEET_TX, USER_NM],
                table : ARTIST_TABLE,
                returning : ARTIST_ID
            );

            return await adoTemplate.QuerySingle(sql, (cmd) => {
                cmd.SetString(ARTIST_NM, artist.Name);
                cmd.SetString(ARTIST_SOCIAL_TX, artist.SocialUrl);
                cmd.SetString(ARTIST_COMM_SHEET_TX, artist.CommSheetUrl);
                cmd.SetString(USER_NM, username);
            }, (reader) => reader.GetInt(0));

        }

        #endregion

        #region READ

        public static readonly Func<Getter, Artist> artistRm = (reader) => new() {
            Id = reader.GetInt(ARTIST_ID),
            Name = reader.GetString(ARTIST_NM),
            SocialUrl = reader.GetString(ARTIST_SOCIAL_TX),
            CommSheetUrl = reader.GetString(ARTIST_COMM_SHEET_TX),
            HasImage = reader.GetBoolean(ARTIST_IMG_PRESENT_IN),
            IsRetired = reader.GetBoolean(RETIRED_IN)
        };

        public async Task<List<Artist>> GetAll(string username) {

            var sql = SelectSql(
                columns: [ARTIST_ID, ARTIST_NM, ARTIST_SOCIAL_TX, ARTIST_COMM_SHEET_TX, ARTIST_IMG_PRESENT_IN, RETIRED_IN],
                table: ARTIST_TABLE,
                new(WhereConditionUnion.AND, [
                    new(USER_NM)
                ]),
                order: [new(ARTIST_NM)]
            );

            return await adoTemplate.Query(sql, (cmd) => cmd.SetString(USER_NM, username), artistRm);

        }

        public async Task<Artist?> Get(string username, int id) {

            var sql = SelectSql(
              columns: [ARTIST_ID, ARTIST_NM, ARTIST_SOCIAL_TX, ARTIST_COMM_SHEET_TX,ARTIST_IMG_PRESENT_IN,RETIRED_IN],
              table: ARTIST_TABLE,
              new WhereConditionGroup(WhereConditionUnion.AND, [
                  new(USER_NM), new(ARTIST_ID)
              ])
          );

            return await adoTemplate.QuerySingle(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                cmd.SetInt(ARTIST_ID, id);
            }, artistRm);
        }

        public async Task<ImageDownload?> GetImage(string username, int id) {

            var sql = SelectSql(
              columns: [ARTIST_IMG_BYTES, ARTIST_NM, ARTIST_IMG_MIME_TX],
              table: ARTIST_TABLE,
              new WhereConditionGroup(WhereConditionUnion.AND, [
                  new(USER_NM), new(ARTIST_ID)
              ])
          );

            return await adoTemplate.QuerySingle(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                cmd.SetInt(ARTIST_ID, id);
            }, (reader) => new ImageDownload() { 
                Filename= reader.GetString(ARTIST_NM),
                Mime = reader.GetOptionalString(ARTIST_IMG_MIME_TX),
                Data = reader.GetOptionalBytea(ARTIST_IMG_BYTES),
            });
        }

        #endregion

        #region UPDATE

        public async Task Update(string username, Artist artist) {

            var sql = UpdateSql(
                columns: [ARTIST_NM, ARTIST_SOCIAL_TX, ARTIST_COMM_SHEET_TX, RETIRED_IN],
                table: ARTIST_TABLE,
                new(WhereConditionUnion.AND, [
                    new(USER_NM), new(ARTIST_ID)
                    ]));

            await adoTemplate.Execute(sql, (cmd) => {
                cmd.SetString(ARTIST_NM, artist.Name);
                cmd.SetString(ARTIST_SOCIAL_TX, artist.SocialUrl);
                cmd.SetString(ARTIST_COMM_SHEET_TX, artist.CommSheetUrl);
                cmd.SetString(USER_NM, username);
                cmd.SetInt(ARTIST_ID, artist.Id);
                cmd.SetBoolean(RETIRED_IN, artist.IsRetired);
            });
        }

        public async Task UpdateImage(string username, int id, byte[] image, string mime) {
            var sql = UpdateSql(
                   columns: [ARTIST_IMG_BYTES, ARTIST_IMG_MIME_TX],
                   table: ARTIST_TABLE,
                   new(WhereConditionUnion.AND, [
                       new(USER_NM), new(ARTIST_ID)
                       ]));

            await adoTemplate.Execute(sql, (cmd) => {
                cmd.SetBytea(ARTIST_IMG_BYTES, image);
                cmd.SetString(ARTIST_IMG_MIME_TX, mime);
                cmd.SetString(USER_NM, username);
                cmd.SetInt(ARTIST_ID, id);
            });
        }

        #endregion

        #region DELETE
        //We won't support deleting artists
        #endregion

        #region CHECK
        
        public static async Task<bool> UserOwnsArtist(AdoTemplate template, string username, int id) 
            => await UserOwns(template,ARTIST_TABLE,username,ARTIST_ID,id);

        #endregion

    }
}
