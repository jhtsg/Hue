using Hue.Common;
using Hue.Data.Utils;
using static Hue.Data.Utils.AdoTemplate;
using static Hue.Data.Utils.SqlBuilder;
using static Hue.Data.Utils.Constants;
using static Hue.Data.Utils.OwnerChecker;
using Hue.Common.Character;

namespace Hue.Data
{
    public class CharacterDAO(string connectionString) {
        readonly AdoTemplate adoTemplate = new(connectionString);

        #region CREATE
        public async Task<int> Create(string username, Character character) {

            var sql = InsertSql(
                columns : [CHAR_NM, CHAR_SPECIES_TX, CHAR_DESC_TX, CHAR_COLOR_TX, CHAR_CAT_ID,USER_NM],
                table : CHAR_TABLE,
                returning : CHAR_ID
            );

            return await adoTemplate.QuerySingle(sql, (cmd) => {
                cmd.SetString(CHAR_NM, character.Name);
                cmd.SetString(CHAR_SPECIES_TX, character.Species);
                cmd.SetString(CHAR_DESC_TX, character.Description);
                cmd.SetString(CHAR_COLOR_TX, character.Color);
                cmd.SetInt(CHAR_CAT_ID, character.Category?.Id);
                cmd.SetString(USER_NM, username);
            }, (reader) => reader.GetInt(0));

        }

        public async Task<int> CreateCategory(string username, CharacterCategory cat) {

            var sql = InsertSql(
                columns: [CHAR_CAT_NM,CHAR_CAT_DESC_TX,CHAR_CAT_COLOR_TX,USER_NM],
                table: CHAR_CAT_TABLE,
                returning: CHAR_CAT_ID
            );

            return await adoTemplate.QuerySingle(sql, (cmd) => {
                cmd.SetString(CHAR_CAT_NM, cat.Name);
                cmd.SetString(CHAR_CAT_DESC_TX, cat.Description);
                cmd.SetString(CHAR_CAT_COLOR_TX, cat.Color);
                cmd.SetString(USER_NM, username);
            }, (reader) => reader.GetInt(0));

        }

        #endregion

        #region READ

        public static readonly Func<Getter, Character> characterRm = (reader) => new() {
            Id = reader.GetInt(CHAR_ID),
            Name = reader.GetString(CHAR_NM),
            Color = reader.GetString(CHAR_COLOR_TX),
            Species = reader.GetString(CHAR_SPECIES_TX),
            Description = reader.GetString(CHAR_DESC_TX),
            Category = !reader.IsNull(CHAR_CAT_NM) && reader.ContainsKey(CHAR_CAT_COLOR_TX) ? characterCatRm!(reader) : null
        };

        public static readonly Func<Getter, CharacterCategory> characterCatRm = (reader) => new() {
            Id = reader.GetInt(CHAR_CAT_ID),
            Name = reader.GetString(CHAR_CAT_NM),
            Color = reader.GetString(CHAR_CAT_COLOR_TX),
            Description = reader.GetString(CHAR_CAT_DESC_TX)
        };

        public async Task<List<Character>> GetAll(string username) {
            var sql = SelectSql(
                columns: [CHAR_ID, CHAR_NM, CHAR_COLOR_TX, CHAR_SPECIES_TX, CHAR_DESC_TX, "cat." + CHAR_CAT_ID, CHAR_CAT_NM, CHAR_CAT_COLOR_TX, CHAR_CAT_DESC_TX],
                table: $"{CHAR_TABLE} c, {CHAR_CAT_TABLE} cat",
                new(WhereConditionUnion.AND, [
                    new ("c." + USER_NM, WhereConditionOperator.EQUALS, "@" + USER_NM ),
                    new JoinCondition("c","cat",CHAR_CAT_ID)
                ]),
                order:[new(CHAR_CAT_NM), new(CHAR_NM)]
            );

            return await adoTemplate.Query(sql, (cmd) => cmd.SetString(USER_NM, username), characterRm);
        }

        public async Task<Character?> Get(string username, int id) {

            var sql = SelectSql(
                columns: [CHAR_ID, CHAR_NM, CHAR_COLOR_TX, CHAR_SPECIES_TX, CHAR_DESC_TX, "cat." + CHAR_CAT_ID, CHAR_CAT_NM, CHAR_CAT_COLOR_TX, CHAR_CAT_DESC_TX],
                table: $"{CHAR_TABLE} c, {CHAR_CAT_TABLE} cat",
                new(WhereConditionUnion.AND, [
                    new ("c." + USER_NM, WhereConditionOperator.EQUALS, "@" + USER_NM ),
                    new JoinCondition("c","cat",CHAR_CAT_ID),
                    new(CHAR_ID)
                ])
            );

            return await adoTemplate.QuerySingle(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                cmd.SetInt(CHAR_ID, id);
            }, characterRm);
        }

        public async Task<List<CharacterCategory>> GetAllCategories(string username) {
            var sql = SelectSql(
                columns: ["*"],
                table: CHAR_CAT_TABLE,
                new(WhereConditionUnion.AND, [new (USER_NM)])
            );

            return await adoTemplate.Query(sql, (cmd) => cmd.SetString(USER_NM, username), characterCatRm);
        }

        public async Task<CharacterCategory?> GetCategory(string username, int id) {
            var sql = SelectSql(
                           columns: ["*"],
                           table: CHAR_CAT_TABLE,
                           new(WhereConditionUnion.AND, [new(USER_NM), new(CHAR_CAT_ID)]),
                           order: [new(CHAR_CAT_NM)]
                       );

            return await adoTemplate.QuerySingle(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                cmd.SetInt(CHAR_CAT_ID, id);
            }, characterCatRm);
        }

        public async Task<ImageDownload?> GetImage(string username, int id) {

            var sql = SelectSql(
             columns: [CHAR_IMG_BYTES, CHAR_NM, CHAR_IMG_MIME_TX],
             table: CHAR_TABLE,
             new(WhereConditionUnion.AND, [
                 new(USER_NM), new(CHAR_ID)
             ])
         );

            return await adoTemplate.QuerySingle(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                cmd.SetInt(CHAR_ID, id);
            }, (reader) => new ImageDownload() {
                Filename = reader.GetString(CHAR_NM),
                Mime = reader.GetOptionalString(CHAR_IMG_MIME_TX),
                Data = reader.GetOptionalBytea(CHAR_IMG_BYTES),
            });
        }

        #endregion

        #region UPDATE

        public async Task Update(string username, Character character) {

            var sql = UpdateSql(
                columns: [CHAR_NM, CHAR_SPECIES_TX, CHAR_DESC_TX, CHAR_COLOR_TX, CHAR_CAT_ID],
                table: CHAR_TABLE,
                new(WhereConditionUnion.AND, [
                    new(USER_NM), new(CHAR_ID)
                ])
            );

            await adoTemplate.Execute(sql, (cmd) => {
                cmd.SetString(CHAR_NM, character.Name);
                cmd.SetString(CHAR_SPECIES_TX, character.Species);
                cmd.SetString(CHAR_DESC_TX, character.Description);
                cmd.SetString(CHAR_COLOR_TX, character.Color);
                cmd.SetInt(CHAR_CAT_ID, character.Category?.Id);
                cmd.SetString(USER_NM, username);
                cmd.SetInt(CHAR_ID, character.Id);
            });
        }

        public async Task UpdateImage(string username, int id, byte[] image, string mime) {
            var sql = UpdateSql(
                    columns: [CHAR_IMG_BYTES, CHAR_IMG_MIME_TX],
                    table: CHAR_TABLE,
                    new(WhereConditionUnion.AND, [
                        new(USER_NM), new(CHAR_ID)
                        ]));

            await adoTemplate.Execute(sql, (cmd) => {
                cmd.SetBytea(CHAR_IMG_BYTES, image);
                cmd.SetString(CHAR_IMG_MIME_TX, mime);
                cmd.SetString(USER_NM, username);
                cmd.SetInt(CHAR_ID, id);
            });
        }

        public async Task UpdateCategory(string username, CharacterCategory category) {

            var sql = UpdateSql(
                columns: [CHAR_CAT_NM, CHAR_CAT_DESC_TX, CHAR_CAT_COLOR_TX],
                table: CHAR_CAT_TABLE,
                new(WhereConditionUnion.AND, [
                    new(USER_NM), new(CHAR_CAT_ID)
                    ]));

            await adoTemplate.Execute(sql, (cmd) => {
                cmd.SetString(CHAR_CAT_NM, category.Name);
                cmd.SetString(CHAR_CAT_DESC_TX, category.Description);
                cmd.SetString(CHAR_CAT_COLOR_TX, category.Color);
                cmd.SetString(USER_NM, username);
                cmd.SetInt(CHAR_CAT_ID, category.Id);
            });
        }

        #endregion

        #region DELETE
        //We won't support deleting characters
        //We could support deleting character categories though
        #endregion

        #region CHECK
        public static async Task<bool> UserOwnsCharacter(AdoTemplate template, string username, int id)
            => await UserOwns(template, CHAR_TABLE, username, CHAR_ID, id);

        public static async Task<bool> UserOwnsAllCharacters(AdoTemplate template, string username, List<int> ids)
            => await UserOwnsAll(template, CHAR_TABLE, username, CHAR_ID, ids);

        #endregion

    }
}
