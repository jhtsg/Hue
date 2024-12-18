using Hue.Common;
using Hue.Data.Utils;
using static Hue.Data.Utils.AdoTemplate;
using static Hue.Data.Utils.SqlBuilder;
using static Hue.Data.Utils.Constants;
using static Hue.Data.Utils.OwnerChecker;
using Hue.Common.Character;
using Hue.Common.Commission;

namespace Hue.Data
{
    public class CommissionDAO(string connectionString) {

        private const int PAGE_SIZE = 9;
        readonly AdoTemplate adoTemplate = new(connectionString);
        readonly ArtistDAO artistDAO = new(connectionString);
        readonly CharacterDAO characterDAO = new(connectionString);

        #region CREATE
        public async Task<int> Create(string username, Commission comm) {

            if (comm.Artist?.Id <= 0) { 
                comm.Artist.Id = await artistDAO.Create(username, comm.Artist);
            }

            //Verify we own everytyhing
            await UserOwnsAllDeps(username, comm);

            var CreateCommSql = InsertSql(
                columns : [
                    COMM_NM, COMM_DESC_TX, COMM_PRICE_NB, COMM_CHAR_CNT, COMM_POST_TAGS_TX,
                    COMM_POST_DESC_TX, COMM_POST_URL_TX, COMM_STATUS_CD, COMM_TYPE_CD, 
                    CRE_TS, START_DT, DONE_DT, PBLSH_DT,
                    ARTIST_ID, USER_NM
                ],
                setValues: new Dictionary<string, string> { 
                    { CRE_TS,"CURRENT_TIMESTAMP" },
                    { COMM_STATUS_CD, "0"} //Commissions are always created to Brainstorm
                },
                table : COMM_TABLE,
                returning : COMM_ID
            );

            var id = await adoTemplate.QuerySingle(CreateCommSql, (cmd) => {
                cmd.SetString(COMM_NM, comm.Name);
                cmd.SetString(COMM_DESC_TX, comm.Description);
                cmd.SetInt(COMM_PRICE_NB, comm.Price);
                cmd.SetInt(COMM_CHAR_CNT,comm.CharCount);
                
                cmd.SetString(COMM_POST_TAGS_TX , comm.PostTags);
                cmd.SetString(COMM_POST_DESC_TX, comm.PostDescription);
                cmd.SetString(COMM_POST_URL_TX, comm.PostUrl);

                cmd.SetDate(START_DT, comm.StartTs);
                cmd.SetDate(DONE_DT, comm.DoneTs);
                cmd.SetDate(PBLSH_DT, comm.PublishTs);

                cmd.SetInt(COMM_STATUS_CD, (int)comm.Status);
                cmd.SetInt(COMM_TYPE_CD, (int)comm.Type);
                cmd.SetInt(ARTIST_ID, comm.Artist?.Id);
                cmd.SetString(USER_NM, username);
            }, (reader) => reader.GetInt(0));

            //Now create the COMM TAG and COMM CHAR maps
            await UpdateCharMap(username, id, comm.Characters);
            await UpdateTagMap(username, id,comm.CommissionTags);

            return id;
        }

        public async Task<int> CreateTag(string username, CommissionTag tag) {

            var sql = InsertSql(
                columns: [COMM_TAG_NM, COMM_TAG_DESC_TX, COMM_TAG_COLOR_TX, USER_NM],
                table: COMM_TAG_TABLE,
                returning: COMM_TAG_ID
            );

            return await adoTemplate.QuerySingle(sql, (cmd) => {
                cmd.SetString(COMM_TAG_NM, tag.Name);
                cmd.SetString(COMM_TAG_DESC_TX, tag.Description);
                cmd.SetString(COMM_TAG_COLOR_TX, tag.Color);
                cmd.SetString(USER_NM, username);
            }, (reader) => reader.GetInt(0));

        }

        #endregion

        #region READ

        private async Task<Commission> CommissionRm (Getter reader) {
            return new() {
                Id = reader.GetInt(COMM_ID),
                Name = reader.GetString(COMM_NM),
                Description = reader.GetString(COMM_DESC_TX),
                Price = reader.GetInt(COMM_PRICE_NB),
                CharCount = reader.GetInt(COMM_CHAR_CNT),
                PostTags = reader.GetString(COMM_POST_TAGS_TX),
                PostDescription = reader.GetString(COMM_POST_DESC_TX),
                PostUrl = reader.GetString(COMM_POST_URL_TX),
                HasImage = reader.GetBoolean(COMM_HEADER_IMG_PRESENT_IN),

                Status = (CommissionStatus)reader.GetInt(COMM_STATUS_CD),
                Type = (CommissionType)reader.GetInt(COMM_TYPE_CD),

                CreateTs = reader.GetDateTime(CRE_TS),
                UpdateTs = reader.GetOptionalDateTime(UPDT_TS),
                StartTs = reader.GetOptionalDateTime(START_DT),
                DoneTs = reader.GetOptionalDateTime(DONE_DT),
                PublishTs = reader.GetOptionalDateTime(PBLSH_DT),
                
                Artist = reader.IsNull(ARTIST_ID) ? null : ArtistDAO.artistRm(reader),
                Characters = await GetCommCharacters(reader.GetInt(COMM_ID)),
                CommissionTags = await GetCommTags(reader.GetInt(COMM_ID))
            };
        }

        public static readonly Func<Getter, CommissionTag> commTagRm = (reader) => new() {
            Id = reader.GetInt(COMM_TAG_ID),
            Name = reader.GetString(COMM_TAG_NM),
            Description = reader.GetString(COMM_TAG_DESC_TX),
            Color = reader.GetString(COMM_TAG_COLOR_TX)
        };

        public async Task<List<Commission>> GetAll(string username, CommissionFilterOptions filter) {

            List<WhereCondition> conditions = CommissionFilterOptionsToWhereConditions(filter);

            var sql = SelectSql(
                columns: [
                    COMM_ID, COMM_NM, COMM_DESC_TX,
                    COMM_PRICE_NB, COMM_CHAR_CNT,
                    COMM_POST_TAGS_TX, COMM_POST_DESC_TX, COMM_POST_URL_TX,
                    COMM_STATUS_CD, COMM_TYPE_CD,
                    CRE_TS, UPDT_TS, START_DT, DONE_DT, PBLSH_DT,
                    "C."+ARTIST_ID, ARTIST_NM, ARTIST_COMM_SHEET_TX, ARTIST_SOCIAL_TX,
                    ARTIST_IMG_PRESENT_IN, COMM_HEADER_IMG_PRESENT_IN
                ],
                table: $"{COMM_TABLE} C LEFT JOIN {ARTIST_TABLE} A ON C.{ARTIST_ID} = A.{ARTIST_ID}",
                new(WhereConditionUnion.AND, conditions),
                [new($"COALESCE({DONE_DT},COALESCE({UPDT_TS},{CRE_TS}))", SortOrder.DESC)]
            );

            if (filter.Page != null) {
                sql += $" LIMIT {PAGE_SIZE} OFFSET {PAGE_SIZE * filter.Page}";
            }



            return await adoTemplate.Query(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                CommissionFilterApplier(filter, cmd);
            }, CommissionRm);

        }

        public async Task<int> GetCount(string username, CommissionFilterOptions filter) {
            
            List<WhereCondition> conditions = CommissionFilterOptionsToWhereConditions(filter);

            var sql = SelectSql(
                columns: ["Count(*)"],
                table: $"{COMM_TABLE} C LEFT JOIN {ARTIST_TABLE} A ON C.{ARTIST_ID} = A.{ARTIST_ID}",
                new WhereConditionGroup(WhereConditionUnion.AND, conditions)
            );

            return await adoTemplate.QuerySingle(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                CommissionFilterApplier(filter, cmd);
            }, (reader) => reader.GetInt(0));

        }

        public async Task<List<CommissionAlert>> GetAlerts(string username) {

            var sql = SelectSql(
                columns:[COMM_ID,COMM_NM,COMM_STATUS_CD,OVERDUE_DAYS_NB],
                table:OVERDUE_COMMS, 
                new WhereConditionGroup([new WhereCondition(USER_NM)]));

            return await adoTemplate.Query(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
            }, (reader) => new CommissionAlert(){
                Id = reader.GetInt(COMM_ID),
                Name = reader.GetString(COMM_NM),
                Status = (CommissionStatus)reader.GetInt(COMM_STATUS_CD),
                DaysOverdue = reader.GetInt(OVERDUE_DAYS_NB)
            });

        }

        private static List<WhereCondition> CommissionFilterOptionsToWhereConditions(CommissionFilterOptions filter) {
            List<WhereCondition> conditions = [
                new("c."+USER_NM, WhereConditionOperator.EQUALS,$"@{USER_NM}")
            ];

            if (filter.ArtistId != null) {
                conditions.Add(new("C." + ARTIST_ID, WhereConditionOperator.EQUALS, $"@{ARTIST_ID}"));
            }

            if (filter.CommissionStatus != null) { conditions.Add(new(COMM_STATUS_CD)); }
            if (filter.Year != null) { conditions.Add(new(COMM_YEAR_NB)); }
            if (filter.CharacterId != null) {
                conditions.Add(new(
                    COMM_ID, WhereConditionOperator.IN, "(" + SelectSql([COMM_ID], COMM_CHAR_MAP, new WhereConditionGroup([new(CHAR_ID)])) + ")"
                ));
            }
            if (filter.CommissionTagId != null) {
                conditions.Add(new(
                    COMM_ID, WhereConditionOperator.IN, "(" + SelectSql([COMM_ID], COMM_TAG_MAP, new WhereConditionGroup([new(COMM_TAG_ID)])) + ")"
                ));
            }

            if (filter.Query?.Trim().Length > 0) {
                conditions.Add(new WhereConditionSubgroup(new(WhereConditionUnion.OR,[
                    new(COMM_NM, WhereConditionOperator.ILIKE, "@QUERY"),
                    new(COMM_DESC_TX, WhereConditionOperator.ILIKE, "@QUERY"),
                    new(COMM_POST_TAGS_TX, WhereConditionOperator.ILIKE, "@QUERY"),
                    new(COMM_POST_DESC_TX, WhereConditionOperator.ILIKE, "@QUERY")
                ])));
            }

            return conditions;
        }

        private static void CommissionFilterApplier(CommissionFilterOptions filter, Setter cmd) {
            if (filter.ArtistId != null) { cmd.SetInt(ARTIST_ID, filter.ArtistId); }
            if (filter.CommissionStatus != null) { cmd.SetInt(COMM_STATUS_CD, (int)filter.CommissionStatus); }
            if (filter.Year != null) { cmd.SetInt(COMM_YEAR_NB, filter.Year); }
            if (filter.CharacterId != null) { cmd.SetInt(CHAR_ID, filter.CharacterId); }
            if (filter.CommissionTagId != null) { cmd.SetInt(COMM_TAG_ID, filter.CommissionTagId); }
            if (filter.Query?.Trim().Length > 0) { cmd.SetString("QUERY", $"%{filter.Query}%"); }
        }

        public async Task<Commission?> Get(string username, int id) {

            var sql = SelectSql(
                columns: [
                    COMM_ID, COMM_NM, COMM_DESC_TX,
                    COMM_PRICE_NB, COMM_CHAR_CNT,
                    COMM_POST_TAGS_TX, COMM_POST_DESC_TX, COMM_POST_URL_TX,
                    COMM_STATUS_CD, COMM_TYPE_CD,
                    CRE_TS, UPDT_TS, START_DT, DONE_DT, PBLSH_DT,
                    "C."+ARTIST_ID, ARTIST_NM, ARTIST_COMM_SHEET_TX, ARTIST_SOCIAL_TX,
                    ARTIST_IMG_PRESENT_IN, COMM_HEADER_IMG_PRESENT_IN
],
                table: $"{COMM_TABLE} C LEFT JOIN {ARTIST_TABLE} A ON C.{ARTIST_ID} = A.{ARTIST_ID}",
                new WhereConditionGroup(WhereConditionUnion.AND, [
                    new("c."+USER_NM, WhereConditionOperator.EQUALS,$"@{USER_NM}"),
                    new(COMM_ID),
                ])
            );

            return await adoTemplate.QuerySingle(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                cmd.SetInt(COMM_ID, id);
            }, CommissionRm);
        }

        public async Task<List<double>> GetYears(string username) {
            var sql = SelectSql(
                    columns:[$"extract(year from coalesce({START_DT},{CRE_TS})) as year"],
                    table:COMM_TABLE,
                    new([new(USER_NM)]),
                    [new("YEAR",SortOrder.DESC)],
                    distinct:true
                );

            return await adoTemplate.Query(sql, (cmd) => cmd.SetString(USER_NM, username), (reader) => reader.GetDouble(0));
        }

        public async Task<ImageDownload?> GetImage(string username, int id) {

            var sql = SelectSql(
              columns: [COMM_HEADER_IMG_BYTES, COMM_NM, COMM_HEADER_IMG_MIME_TYPE],
              table: COMM_TABLE,
              new WhereConditionGroup(WhereConditionUnion.AND, [
                  new(USER_NM), new(COMM_ID)
              ])
          );

            return await adoTemplate.QuerySingle(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                cmd.SetInt(COMM_ID, id);
            }, (reader) => new ImageDownload() { 
                Filename= reader.GetString(COMM_NM),
                Mime = reader.GetOptionalString(COMM_HEADER_IMG_MIME_TYPE),
                Data = reader.GetOptionalBytea(COMM_HEADER_IMG_BYTES),
            });
        }

        public async Task<List<CommissionTag>> GetAllTags(string username) {

            var sql = SelectSql(
                columns: ["*"],
                table: COMM_TAG_TABLE,
                new WhereConditionGroup(WhereConditionUnion.AND, [
                    new(USER_NM)
                ])
            );

            return await adoTemplate.Query(sql, (cmd) => cmd.SetString(USER_NM, username), commTagRm);

        }

        public async Task<CommissionTag?> GetTag(string username, int id) {

            var sql = SelectSql(
              columns: ["*"],
              table: COMM_TAG_TABLE,
              new WhereConditionGroup(WhereConditionUnion.AND, [
                  new(USER_NM), new(ARTIST_ID)
              ])
          );

            return await adoTemplate.QuerySingle(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                cmd.SetInt(COMM_TAG_ID, id);
            }, commTagRm);
        }

        private async Task<List<Character>> GetCommCharacters(int id) {
            var sql = SelectSql(
                columns: [
                    "C." + CHAR_ID, CHAR_NM, CHAR_COLOR_TX, CHAR_SPECIES_TX, CHAR_DESC_TX, CHAR_IMG_PRESENT_IN,
                    "CCAT." + CHAR_CAT_ID, CHAR_CAT_NM, CHAR_CAT_COLOR_TX, CHAR_CAT_DESC_TX
                    ],
                table: $"{COMM_CHAR_MAP} CCM, {CHAR_TABLE} C, {CHAR_CAT_TABLE} ccat",
                new WhereConditionGroup([
                    new JoinCondition("CCM","C",CHAR_ID),
                    new JoinCondition("C","CCAT",CHAR_CAT_ID),
                    new(COMM_ID)
                ])
            );

            return await adoTemplate.Query(sql, (cmd) => cmd.SetInt(COMM_ID, id), CharacterDAO.characterRm);
        }

        private async Task<List<CommissionTag>> GetCommTags(int id) {
            var sql = SelectSql(
                  columns: ["ct.*"],
                  table: $"{COMM_TAG_MAP} ctm, {COMM_TAG_TABLE} ct",
                  new WhereConditionGroup(WhereConditionUnion.AND, [
                      new JoinCondition("ctm","ct",COMM_TAG_ID),
                      new(COMM_ID)
                  ])
              );

            return await adoTemplate.Query(sql, (cmd) => cmd.SetInt(COMM_ID, id), commTagRm);
        }

        #endregion

        #region UPDATE

        public async Task Update(string username, Commission comm) {

            if (comm.Artist?.Id <= 0) {
                comm.Artist.Id = await artistDAO.Create(username, comm.Artist);
            }

            //Verify we own everytyhing
            if (!await UserOwnsCommission(adoTemplate, username,comm.Id)) return;
            await UserOwnsAllDeps(username, comm);

            var CreateCommSql = UpdateSql(
                columns: [
                    COMM_NM, COMM_DESC_TX, COMM_PRICE_NB, COMM_CHAR_CNT, COMM_POST_TAGS_TX, COMM_POST_URL_TX,
                    COMM_POST_DESC_TX, COMM_STATUS_CD, COMM_TYPE_CD, UPDT_TS, START_DT, DONE_DT, PBLSH_DT, ARTIST_ID
                ],
                setValues: new Dictionary<string, string> { 
                    { UPDT_TS, "CURRENT_TIMESTAMP" } 
                },
                conditions: new WhereConditionGroup([new(USER_NM), new(COMM_ID)]),
                table: COMM_TABLE
            );

            await adoTemplate.Execute(CreateCommSql, (cmd) => {
                cmd.SetString(COMM_NM, comm.Name);
                cmd.SetString(COMM_DESC_TX, comm.Description);
                
                cmd.SetInt(COMM_PRICE_NB, comm.Price);
                cmd.SetInt(COMM_CHAR_CNT, comm.CharCount);
                
                cmd.SetString(COMM_POST_TAGS_TX, comm.PostTags);
                cmd.SetString(COMM_POST_DESC_TX, comm.PostDescription);
                cmd.SetString(COMM_POST_URL_TX, comm.PostUrl);

                cmd.SetInt(COMM_STATUS_CD, (int)comm.Status);
                cmd.SetInt(COMM_TYPE_CD, (int)comm.Type);

                cmd.SetDate(START_DT, comm.StartTs);
                cmd.SetDate(DONE_DT, comm.DoneTs);
                cmd.SetDate(PBLSH_DT, comm.PublishTs);

                cmd.SetInt(ARTIST_ID, comm.Artist?.Id);
                
                cmd.SetString(USER_NM, username);
                cmd.SetInt(COMM_ID, comm.Id);
            });

            //Now create the COMM TAG and COMM CHAR maps
            await UpdateCharMap(username,comm.Id, comm.Characters);
            await UpdateTagMap(username,comm.Id, comm.CommissionTags);


        }

        public async Task UpdateImage(string username, int id, byte[] image, string mime) {
            var sql = UpdateSql(
                   columns: [COMM_HEADER_IMG_BYTES, COMM_HEADER_IMG_MIME_TYPE],
                   table: COMM_TABLE,
                   new(WhereConditionUnion.AND, [
                       new(USER_NM), new(COMM_ID)
                       ]));

            await adoTemplate.Execute(sql, (cmd) => {
                cmd.SetBytea(COMM_HEADER_IMG_BYTES, image);
                cmd.SetString(COMM_HEADER_IMG_MIME_TYPE, mime);
                cmd.SetString(USER_NM, username);
                cmd.SetInt(COMM_ID, id);
            });
        }

        public async Task UpdateTag(string username, CommissionTag tag) {

            var sql = UpdateSql(
                columns: [COMM_TAG_NM, COMM_TAG_DESC_TX, COMM_TAG_COLOR_TX],
                table: COMM_TAG_TABLE,
                new(WhereConditionUnion.AND, [new(USER_NM), new(COMM_TAG_ID)]));

            await adoTemplate.Execute(sql, (cmd) => {
                cmd.SetString(COMM_TAG_NM, tag.Name);
                cmd.SetString(COMM_TAG_DESC_TX, tag.Description);
                cmd.SetString(COMM_TAG_COLOR_TX, tag.Color);
                cmd.SetString(USER_NM, username);
                cmd.SetInt(COMM_TAG_ID, tag.Id);
            });
        }

        private async Task UpdateTagMap(string username, int commId, List<CommissionTag> commissionTags) {

            //Clear the tag map for this commission
            var delSql = DeleteSql(COMM_TAG_MAP, new([new(COMM_ID)]));
            await adoTemplate.Execute(delSql, (cmd) => cmd.SetInt(COMM_ID, commId));

            //Add all of them back
            var setSql = InsertSql([COMM_ID, COMM_TAG_ID],COMM_TAG_MAP);
            await adoTemplate.ExecuteBatch(setSql, async (cmd, t) => {

                //Create tags if necessary
                if (t.Id <= 0) {
                    t.Id = await CreateTag(username, t);
                }

                cmd.SetInt(COMM_ID, commId);
                cmd.SetInt(COMM_TAG_ID, t.Id);
            }, commissionTags);

        }
        
        private async Task UpdateCharMap(string username, int commId, List<Character> characters) {

            //Clear the tag map for this commission
            var delSql = DeleteSql(COMM_CHAR_MAP, new([new(COMM_ID)]));
            await adoTemplate.Execute(delSql, (cmd) => cmd.SetInt(COMM_ID, commId));

            //Add all of them back
            var setSql = InsertSql([COMM_ID, CHAR_ID], COMM_CHAR_MAP);
            await adoTemplate.ExecuteBatch(setSql, async (cmd, t) => {

                if (t.Id <= 0) {
                    t.Id = await characterDAO.Create(username, t);
                }

                cmd.SetInt(COMM_ID, commId);
                cmd.SetInt(CHAR_ID, t.Id);
            }, characters);
        }

        #endregion

        #region DELETE

        //We WILL allow deleting commissions and commissionTags

        public async Task DeleteTag(string username, int id) {

            if (!(await UserOwnsCommissionTag(adoTemplate, username, id))){
                return;
            }

            var delSql = $@"
{DeleteSql(COMM_TAG_MAP, new(WhereConditionUnion.AND, [new(COMM_TAG_ID)]))};
{DeleteSql(COMM_TAG_TABLE, new(WhereConditionUnion.AND, [new(COMM_TAG_ID)]))};
";

            await adoTemplate.Execute(delSql, (cmd) => cmd.SetInt(COMM_TAG_ID, id));
        }

        public async Task DeleteCommission(string username, int id) {

            if (!(await UserOwnsCommission(adoTemplate, username, id))){
                return;
            }
            
            var delSql = $@"
{DeleteSql(COMM_TAG_MAP, new(WhereConditionUnion.AND, [new(COMM_ID)]))};
{DeleteSql(COMM_CHAR_MAP, new(WhereConditionUnion.AND, [new(COMM_ID)]))};
{DeleteSql(COMM_TABLE, new(WhereConditionUnion.AND, [new(COMM_ID)]))};
";

            await adoTemplate.Execute(delSql, (cmd) => cmd.SetInt(COMM_ID, id));

        }

        #endregion

        #region CHECK

        public async Task UserOwnsAllDeps(string username, Commission commission) {

            //Verify we own the artist
            if (commission.Artist != null && !await ArtistDAO.UserOwnsArtist(adoTemplate,username,commission.Artist.Id)) {
                throw new ArgumentException("Artist is not owned by user");
            }

            //Verify we own the characters
            if (commission.Characters.Count > 0 && !await CharacterDAO.UserOwnsAllCharacters(adoTemplate, username, commission.Characters.Select(A=>A.Id).ToList())) {
                throw new ArgumentException("At least one character is not owned by user");
            }

            //Verify we own the tags
            if(commission.CommissionTags.Count > 0 && !await UserOwnsAllCommissionTags(adoTemplate,username,commission.CommissionTags.Where(a=>a.Id > 0).Select(a=>a.Id).ToList())) {
                throw new ArgumentException("At least one tag is not owned by user");
            }

        }

        public static async Task<bool> UserOwnsCommission(AdoTemplate template, string username, int id)
            => await UserOwns(template, COMM_TABLE, username, COMM_ID, id);

        public static async Task<bool> UserOwnsCommissionTag(AdoTemplate template, string username, int id)
            => await UserOwns(template, COMM_TAG_TABLE, username, COMM_ID, id);

        public static async Task<bool> UserOwnsAllCommissionTags(AdoTemplate template, string username, List<int> ids)
           => await UserOwnsAll(template, COMM_TAG_TABLE, username, COMM_TAG_ID, ids);

        #endregion

    }
}
