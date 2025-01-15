using Hue.Data.Utils;
using static Hue.Data.Utils.SqlBuilder;
using static Hue.Data.Utils.Constants;
using Hue.Common.Commission;
using Hue.Common;

namespace Hue.Data {
    public class CommissionImagesDAO(string connectionString) {
        readonly AdoTemplate adoTemplate = new(connectionString);

        #region create
        public async Task<int> Create(string username, 
                int commId, string notes, int typeCode,
                byte[] image, string mime
        ) {

            if (!(await CommissionDAO.UserOwnsCommission(adoTemplate, username, commId))){
                throw new InvalidOperationException("User does not own this commission");
            };

            var sql = InsertSql(
                   columns: [
                       COMM_ID,COMM_IMG_NOTES_TX, COMM_IMG_TYPE_CD,
                       COMM_IMG_BYTES, COMM_IMG_MIME_TX,
                       CRE_TS
                    ],
                     new Dictionary<string, string> {{ CRE_TS,"CURRENT_TIMESTAMP" }},
                   table: ARTIST_TABLE,
                   COMM_IMG_ID
                   );

            return await adoTemplate.QuerySingle(sql, (cmd) => {
                cmd.SetInt(COMM_ID, commId);
                cmd.SetString(COMM_IMG_NOTES_TX, notes);
                cmd.SetInt(COMM_IMG_TYPE_CD, typeCode);
                cmd.SetBytea(COMM_IMG_BYTES, image);
                cmd.SetString(COMM_IMG_MIME_TX, mime);
            },(reader)=>reader.GetInt(COMM_IMG_ID));
        }

        #endregion

        #region read

        public async Task<List<CommissionAssociatedImage>> GetAll(string username, int commId, CommissionAssociatedImage.ImageType type) {

            var sql = SelectSql(
                columns: [ COMM_IMG_ID,COMM_IMG_NOTES_TX, CRE_TS],
                table: $"{COMM_IMG_TABLE} ci, {COMM_TABLE} c",
                new WhereConditionGroup([
                    new JoinCondition("ci","c",COMM_ID), new(USER_NM), new(COMM_IMG_TYPE_CD),
                    new("c." + COMM_ID, WhereConditionOperator.EQUALS, "@" + COMM_ID)
                ]),
                [new(CRE_TS)]
            );

            return await adoTemplate.Query(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                cmd.SetInt(COMM_IMG_TYPE_CD, (int)type);
                cmd.SetInt(COMM_ID, commId);

            }, (reader) => new CommissionAssociatedImage() {
                Id = reader.GetInt(COMM_IMG_ID),
                Notes = reader.GetString(COMM_IMG_NOTES_TX),
                Type = type,
                CreateTs = reader.GetDateTime(CRE_TS)
            });

        }

        public async Task<ImageDownload?> GetImage(string username, int id) {

            var sql = SelectSql(
                columns: [COMM_IMG_MIME_TX, COMM_IMG_BYTES],
                table: $"{COMM_IMG_TABLE} ci, {COMM_TABLE} c",
                new WhereConditionGroup([
                    new JoinCondition("ci","c",COMM_ID), new(USER_NM), new(COMM_IMG_ID),
                ]),
                [new(CRE_TS)]
            );

            return await adoTemplate.QuerySingle(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                cmd.SetInt(COMM_IMG_ID, id);
            }, (reader) => new ImageDownload() {
                Filename = reader.GetString("image"),
                Mime = reader.GetOptionalString(COMM_IMG_MIME_TX),
                Data = reader.GetOptionalBytea(COMM_IMG_BYTES),
            });
        }

        #endregion

        #region delete

        public async Task Delete(string username, int id) {

            //Verify that the user owns the commission tied to this thing
            var checkSql = SelectSql(
                columns: ["Count(*)"],
                table: $"{COMM_IMG_TABLE} ci, {COMM_TABLE} c",
                new WhereConditionGroup([
                    new JoinCondition("ci","c",COMM_ID), new(USER_NM), new(COMM_IMG_ID)
                ])
            );

            var owns = await adoTemplate.QuerySingle(checkSql, (cmd) => {
                cmd.SetString(USER_NM, username);
                cmd.SetInt(COMM_IMG_ID, id);
            }, (reader) => reader.GetInt(0) > 1);

            if (!owns) return;

            var delSql = DeleteSql(COMM_IMG_TABLE, new([new(COMM_IMG_ID)]));

            await adoTemplate.Execute(delSql, (cmd) => cmd.SetInt(COMM_IMG_ID, id));

        }

        #endregion

    }
}
