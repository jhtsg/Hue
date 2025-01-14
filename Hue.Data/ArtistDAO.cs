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
        readonly ServicesDAO servicesDao = new(connectionString);

        #region CREATE
        public async Task<int> Create(string username, Artist artist) {

            var sql = InsertSql(
                columns : [ARTIST_NM, ARTIST_SOCIAL_TX, ARTIST_COMM_SHEET_TX, USER_NM, PAYMENT_URL_TX],
                table : ARTIST_TABLE,
                returning : ARTIST_ID
            );

            return await adoTemplate.QuerySingle(sql, (cmd) => {
                cmd.SetString(ARTIST_NM, artist.Name);
                cmd.SetString(ARTIST_SOCIAL_TX, artist.SocialUrl);
                cmd.SetString(ARTIST_COMM_SHEET_TX, artist.CommSheetUrl);
                cmd.SetString(PAYMENT_URL_TX, artist.PaymentUrl);
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
            PaymentUrl = reader.GetOptionalString(PAYMENT_URL_TX) ?? "",
            IsRetired = reader.GetBoolean(RETIRED_IN)
        };

        public async Task<List<Artist>> GetAll(string username) {

            var sql = SelectSql(
                columns: [ARTIST_ID, ARTIST_NM, ARTIST_SOCIAL_TX, ARTIST_COMM_SHEET_TX, ARTIST_IMG_PRESENT_IN, RETIRED_IN,PAYMENT_URL_TX],
                table: ARTIST_TABLE,
                new(WhereConditionUnion.AND, [
                    new(USER_NM)
                ]),
                order: [new(RETIRED_IN), new(ARTIST_NM)]
            );

            return await adoTemplate.Query(sql, (cmd) => cmd.SetString(USER_NM, username), artistRm);

        }

        public async Task<Artist?> Get(string username, int id) {

            var sql = SelectSql(
              columns: [ARTIST_ID, ARTIST_NM, ARTIST_SOCIAL_TX, ARTIST_COMM_SHEET_TX,ARTIST_IMG_PRESENT_IN,RETIRED_IN,PAYMENT_URL_TX],
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
                columns: [ARTIST_NM, ARTIST_SOCIAL_TX, ARTIST_COMM_SHEET_TX, RETIRED_IN,PAYMENT_URL_TX],
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
                cmd.SetString(PAYMENT_URL_TX, artist.PaymentUrl);
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

        public async Task DeleteArtist(string username, int id) {

            if (!(await UserOwnsArtist(adoTemplate, username, id))){
                throw new InvalidOperationException("User does not own artist");
            }

            var checkSql = SelectSql(["Count(*)"], COMM_TABLE, new WhereConditionGroup([new(ARTIST_ID)]));
            if (await adoTemplate.QuerySingle(checkSql, (cmd) => cmd.SetInt(ARTIST_ID, id), (reader) => reader.GetInt(0) > 0)) {
                throw new InvalidOperationException("Artist is assigned to commissions");
            }

            await servicesDao.DeleteAllFromArtist(username, id);

            var sql = DeleteSql(ARTIST_TABLE, new([new(ARTIST_ID)]));
            await adoTemplate.Execute(sql, (cmd) => cmd.SetInt(ARTIST_ID,id));
        }

        #endregion

        #region CHECK
        
        public static async Task<bool> UserOwnsArtist(AdoTemplate template, string username, int id) 
            => await UserOwns(template,ARTIST_TABLE,username,ARTIST_ID,id);

        #endregion

    }
}
