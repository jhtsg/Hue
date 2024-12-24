using Hue.Common.Commission;
using Hue.Common.Statistics;
using Hue.Data.Utils;
using static Hue.Data.Utils.AdoTemplate;
using static Hue.Data.Utils.Constants;
using static Hue.Data.Utils.SqlBuilder;
using static Hue.Data.CommissionDAO;

namespace Hue.Data {
    public class StatisticsDAO(string connectionString) {

        readonly AdoTemplate adoTemplate = new(connectionString);

        #region At A Glance

        private static readonly Func<Getter, AtAGlance> atAGlanceRm = (reader) => new() {
            TotalComms = reader.GetInt(TOTAL_COMM_NB),
            TotalSpent = reader.GetInt(TOTAL_SPENT_NB),
            TotalYetToComm = reader.GetInt(TOTAL_NOT_COMM_NB),
            TotalYetToSpend = reader.GetInt(TOTAL_NOT_SPENT_NB),
            AverageCommsPerMonth = reader.GetInt(AVG_COMM_BY_MONTH_NB),
            AveragePrice = reader.GetDouble(AVG_PRICE_NB),
            AverageSpentPerMonth = reader.GetOptionalInt(AVG_SPENT_NB) ?? 0,
            AverageTTC = reader.GetOptionalDouble(AVG_TTC_NB) ?? 0
        };

        public async Task<AtAGlance?> GetOverallAtAGlance(string username) {
            var sql = SelectSql(["*"],AT_A_GLANCE_VIEW,new WhereConditionGroup([new(USER_NM)]));

            return await adoTemplate.QuerySingle(sql, (cmd) => cmd.SetString(USER_NM, username), atAGlanceRm);
        }
        
        public async Task<AtAGlance?> GetYearAtAGlance(string username, int year) {
            var sql = SelectSql(["*"], YEARLY_AT_A_GLANCE_VIEW, new WhereConditionGroup([new(USER_NM), new(COMM_YEAR_NB)]));

            return await adoTemplate.QuerySingle(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                cmd.SetInt(COMM_YEAR_NB, year);
            }, atAGlanceRm);
        }

        #endregion

        #region Monthly Comm Price Cat

        private static readonly Func<Getter, MonthlyPriceCat> priceCatRm = (reader) => new() {
            Year = reader.GetInt(COMM_YEAR_NB),
            Month = reader.GetInt(COMM_MONTH_NB),
            Small = reader.GetInt(SMALL_COMM_CNT),
            Med = reader.GetInt(MED_COMM_CNT),
            Large = reader.GetInt(LARGE_COMM_CNT)
        };


        public async Task<List<MonthlyPriceCat>> GetMonthlyPriceCat(string username, int year) {
            var sql = SelectSql(["*"], MONTHLY_COMM_PRICE_CAT_VIEW, new WhereConditionGroup([new(USER_NM), new(COMM_YEAR_NB)]));

            return await adoTemplate.Query(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                cmd.SetInt(COMM_YEAR_NB, year);
            }, priceCatRm);
        }


        #endregion

        #region MONTHLY SPEND

        private static readonly Func<Getter, MonthlySpend> spendRm = (reader) => new() {
            Year = reader.GetInt(COMM_YEAR_NB),
            Month = reader.GetInt(COMM_MONTH_NB),
            Confirmed = reader.GetInt(CONFIRMED_SPENT_NB),
            Potential = reader.GetInt(POTENTIAL_SPENT_NB),
        };

        public async Task<List<MonthlySpend>> GetMonthlySpend(string username, int year) {
            var sql = SelectSql(["*"], MONTHLY_SPEND_VIEW, new WhereConditionGroup([new(USER_NM), new(COMM_YEAR_NB)]));

            return await adoTemplate.Query(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                cmd.SetInt(COMM_YEAR_NB, year);
            }, spendRm);
        }

        #endregion

        #region MONTHLY STATUS

        private static readonly Func<Getter, MonthlyStatus> statusRm = (reader) => new() {
            Year = reader.GetInt(COMM_YEAR_NB),
            Month = reader.GetInt(COMM_MONTH_NB),
            Brainstorm = reader.GetInt(BRAINSTORM_CNT),
            Scheduled = reader.GetInt(SCHEDULED_CNT),
            InProgress = reader.GetInt(IN_PROG_CNT),
            Done = reader.GetInt(DONE_CNT),
            Published = reader.GetInt(PUBLISH_CNT)
        };

        public async Task<List<MonthlyStatus>> GetMonthlyStatus(string username, int year) {
            var sql = SelectSql(["*"], MONTHLY_STATUS_VIEW, new WhereConditionGroup([new(USER_NM), new(COMM_YEAR_NB)]));

            return await adoTemplate.Query(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                cmd.SetInt(COMM_YEAR_NB, year);
            }, statusRm);
        }

        #endregion

        #region OTHER STATISTICS

        private static Func<Getter, T> StatisticRm<T>(string idColumn, string nameColumn, string? colorColumn = null) where T : Statistic, new() {
            return (reader) => new() {
                Id = reader.GetInt(idColumn),
                Name = reader.GetString(nameColumn),
                Color = colorColumn == null ? "" : reader.GetString(colorColumn),
                Count = reader.GetInt(COMM_CNT),
                Spent = reader.GetInt(SPENT_NB),
                LastSeen = reader.GetOptionalDateTime(LAST_PBLSH_DT),
                HasImage = reader.GetBoolean(IMAGE_IN)
            };
        }

        private static Func<Getter, StatisticByYear> YearlyStatisticRm(string idColumn, string nameColumn, string? colorColumn = null) {
            return (reader) => new() {
                Year = reader.GetInt(COMM_YEAR_NB),
                Id = reader.GetInt(idColumn),
                Name = reader.GetString(nameColumn),
                Color = colorColumn == null ? "" : reader.GetString(colorColumn),
                Count = reader.GetInt(COMM_CNT),
                Spent = reader.GetInt(SPENT_NB),
                LastSeen = reader.GetOptionalDateTime(LAST_PBLSH_DT),
                HasImage = reader.GetBoolean(IMAGE_IN)
            };
        }

        private static Func<Getter, ArtistStatistic> ArtistStatisticRm => (reader) => {
                var statistic = StatisticRm<ArtistStatistic>(ARTIST_ID, ARTIST_NM).Invoke(reader);
                statistic.AverageDaysToComplete = reader.GetOptionalDouble(AVG_TTC_NB);
                return statistic;
            };
        
        private static Func<Getter, StatisticByYear> YearlyArtistStatisticRm = YearlyStatisticRm(ARTIST_ID, ARTIST_NM);
        private static Func<Getter, Statistic> TagStatisticRm = StatisticRm<Statistic>(COMM_TAG_ID,COMM_TAG_NM,COMM_TAG_COLOR_TX);
        private static Func<Getter, StatisticByYear> YearlyTagStatisticRm = YearlyStatisticRm(COMM_TAG_ID,COMM_TAG_NM,COMM_TAG_COLOR_TX);
        private static Func<Getter, Statistic> CharStatisticRm = StatisticRm<Statistic>(CHAR_ID, CHAR_NM, CHAR_COLOR_TX);
        private static Func<Getter, StatisticByYear> YearlyCharStatisticRm = YearlyStatisticRm(CHAR_ID, CHAR_NM, CHAR_COLOR_TX);

        private async Task<List<T>> GetOverallStatistics<T>(string username, string view, Func<Getter,T> rm) where T : Statistic, new() {
            var sql = SelectSql(["*"], view, new WhereConditionGroup([new(USER_NM)]));

            return await adoTemplate.Query(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
            }, rm);
        }

        private async Task<List<StatisticByYear>> GetYearlyStatistics(string username, string view, int year, Func<Getter, StatisticByYear> rm) {
             var sql = SelectSql(["*"], view, new WhereConditionGroup([new(USER_NM), new(COMM_YEAR_NB)]));

            return await adoTemplate.Query(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                cmd.SetInt(COMM_YEAR_NB, year);
            }, rm);
        }
        private async Task<T?> GetOverallStatisticForItem<T>(string username, string view, string idColumn, int id, Func<Getter, T> rm) where T : Statistic, new() {
            var sql = SelectSql(["*"], view, new WhereConditionGroup([new(USER_NM), new(idColumn)]));

            return await adoTemplate.QuerySingle (sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                cmd.SetInt(idColumn, id);
            }, rm);

        }
        private async Task<StatisticByYear?> GetYearlyStatisticForItem(string username, string view, string idColumn, int id, int year, Func<Getter, StatisticByYear> rm) {
            var sql = SelectSql(["*"], view, new WhereConditionGroup([new(USER_NM), new(idColumn),new(COMM_YEAR_NB)]));

            return await adoTemplate.QuerySingle(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                cmd.SetInt(idColumn, id);
                cmd.SetInt(COMM_YEAR_NB, year);
            }, rm);
        }

        public async Task<List<ArtistStatistic>> GetOverallArtistStatistics(string username) => await GetOverallStatistics(username, ARTIST_STATISTICS, ArtistStatisticRm);
        public async Task<List<StatisticByYear>> GetYearlyArtistStatistics(string username,int year) => await GetYearlyStatistics(username, YEARLY_ARTIST_STATISTICS, year, YearlyArtistStatisticRm);
        public async Task<ArtistStatistic?> GetOverallStatisticForArtist(string username, int id) => await GetOverallStatisticForItem(username, ARTIST_STATISTICS, ARTIST_ID, id, ArtistStatisticRm);
        public async Task<StatisticByYear?> GetYearlyStatisticForArtist(string username, int id, int year) => await GetYearlyStatisticForItem(username, YEARLY_ARTIST_STATISTICS, ARTIST_ID, id, year, YearlyArtistStatisticRm);

        public async Task<List<Statistic>> GetOverallCharacterStatistics(string username) => await GetOverallStatistics(username, CHAR_STATISTICS, CharStatisticRm);
        public async Task<List<StatisticByYear>> GetYearlyCharacterStatistics(string username, int year) => await GetYearlyStatistics(username, YEARLY_CHAR_STATISTICS, year, YearlyCharStatisticRm);
        public async Task<Statistic?> GetOverallStatisticForCharacter(string username, int id) => await GetOverallStatisticForItem(username, CHAR_STATISTICS, CHAR_ID, id, CharStatisticRm);
        public async Task<StatisticByYear?> GetYearlyStatisticForCharacter(string username, int id, int year) => await GetYearlyStatisticForItem(username, YEARLY_CHAR_STATISTICS, CHAR_ID, id, year, YearlyCharStatisticRm);

        public async Task<List<Statistic>> GetOverallTagStatistics(string username) => await GetOverallStatistics(username, TAG_STATISTICS, TagStatisticRm);
        public async Task<List<StatisticByYear>> GetYearlyTagStatistics(string username, int year) => await GetYearlyStatistics(username, YEARLY_TAG_STATISTICS, year, YearlyTagStatisticRm);
        public async Task<Statistic?> GetOverallStatisticForTag(string username, int id) => await GetOverallStatisticForItem(username, TAG_STATISTICS, COMM_TAG_ID, id, TagStatisticRm);
        public async Task<StatisticByYear?> GetYearlyStatisticForTag(string username, int id, int year) => await GetYearlyStatisticForItem(username, YEARLY_TAG_STATISTICS, COMM_TAG_ID, id, year, YearlyTagStatisticRm);

        #endregion

        #region COMMISSION STATISTICS

        public async Task<CommissionStatistics> GetCommissionStatistics(string username, CommissionFilterOptions filters) {
            return new() { 
                Types = await GetTypeCount(username, filters),
                CumulativeSpending = await GetCumulativeSpending(username, filters),
                TimeToCompletion = filters.ArtistId != null ? await GetTTC(username,filters) : null,
                ArtistCounts = filters.ArtistId==null ? await GetArtistCounts(username, filters) : null,
                CharacterCounts = filters.CharacterId==null ? await GetCharacterCounts(username, filters) : null,
                TagCounts = filters.CommissionTagId==null ? await GetTagCounts(username, filters) : null
            };
        
        }

        private async Task<List<CommissionStatistics.TypeCount>> GetTypeCount(string username, CommissionFilterOptions filter) {

            List<WhereCondition> conditions = CommissionFilterOptionsToWhereConditions(filter);

            var sql = SelectSql(
                columns: [COMM_TYPE_CD, "count(*) as count"],
                table: COMM_TABLE + " c",
                new WhereConditionGroup(conditions)
            ) + $"GROUP BY {COMM_TYPE_CD}";

            return await adoTemplate.Query(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                CommissionFilterApplier(filter, cmd);
            }, (reader) => new CommissionStatistics.TypeCount() { 
                Type = (CommissionType)reader.GetInt(COMM_TYPE_CD),
                Count = reader.GetInt("count")
            });

        }

        private async Task<List<CommissionStatistics.DateValuePair>> GetTTC(string username, CommissionFilterOptions filter) {
            List<WhereCondition> conditions = CommissionFilterOptionsToWhereConditions(filter);
            conditions.Add(new(START_DT, WhereConditionOperator.IS_NOT_NULL));
            conditions.Add(new(COMM_TTC_NB, WhereConditionOperator.IS_NOT_NULL));

            var sql = SelectSql(
                columns: [COMM_ID, START_DT, COMM_NM, COMM_TTC_NB, COMM_HEADER_IMG_PRESENT_IN],
                table: COMM_TABLE + " c",
                new WhereConditionGroup(conditions),
                order: [new(START_DT)]
            );

            return await adoTemplate.Query(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                CommissionFilterApplier(filter, cmd);
            }, (reader) => new CommissionStatistics.DateValuePair() {
                Id = reader.GetInt(COMM_ID),
                Date = reader.GetDateTime(START_DT),
                Name = reader.GetString(COMM_NM),
                Value = reader.GetDouble(COMM_TTC_NB),
                HasImage = reader.GetBoolean(COMM_HEADER_IMG_PRESENT_IN)
            });

        }

        private async Task<List<CommissionStatistics.CumulativeSpendingData>> GetCumulativeSpending(string username, CommissionFilterOptions filter) {
            List<WhereCondition> conditions = CommissionFilterOptionsToWhereConditions(filter);
            conditions.Add(new(START_DT, WhereConditionOperator.IS_NOT_NULL));

            var sql = SelectSql(
                columns: [COMM_ID, START_DT, COMM_NM, COMM_PRICE_NB,COMM_STARTED_IN,COMM_HEADER_IMG_PRESENT_IN,
                    "sum(comm_price_nb) over (order by start_dt) as running_total_price_nb"
                ], table: COMM_TABLE + " c",
                new WhereConditionGroup(conditions),
                order: [new(START_DT)]
            );

            return await adoTemplate.Query(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                CommissionFilterApplier(filter, cmd);
            }, (reader) => new CommissionStatistics.CumulativeSpendingData() {
                Id = reader.GetInt(COMM_ID),
                Date = reader.GetDateTime(START_DT),
                Name = reader.GetString(COMM_NM),
                Value = reader.GetDouble(COMM_PRICE_NB),
                RunningTotal = reader.GetDouble("running_total_price_nb"),
                Started = reader.GetBoolean(COMM_STARTED_IN),
                HasImage = reader.GetBoolean(COMM_HEADER_IMG_PRESENT_IN)
            });
        }

        private async Task<List<CommissionStatistics.ArtistCount>> GetArtistCounts(string username, CommissionFilterOptions filter) {
            List<WhereCondition> conditions = CommissionFilterOptionsToWhereConditions(filter);
            
            var sql = SelectSql(
                columns: ["c." + ARTIST_ID, "c.count",
                    ARTIST_NM,ARTIST_SOCIAL_TX,ARTIST_COMM_SHEET_TX,ARTIST_IMG_PRESENT_IN,RETIRED_IN
                ], table: $"({
                    SelectSql(
                        columns: [ARTIST_ID,"count(*) as count"],
                        table:COMM_TABLE + " C",
                        new WhereConditionGroup(conditions)
                    )    
                } GROUP BY {ARTIST_ID}) c, {ARTIST_TABLE} a",
                new WhereConditionGroup([new JoinCondition("c","a",ARTIST_ID)]),
                order: [new("c.count",SortOrder.DESC)]
            );

            return await adoTemplate.Query(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                CommissionFilterApplier(filter, cmd);
            }, (reader) => new CommissionStatistics.ArtistCount() {
                Artist = ArtistDAO.artistRm(reader),
                Count = reader.GetInt("count")
            });
        }

        private async Task<List<CommissionStatistics.CharacterCount>> GetCharacterCounts(string username, CommissionFilterOptions filter) {
            List<WhereCondition> conditions = CommissionFilterOptionsToWhereConditions(filter);
            conditions.Add(new JoinCondition("c", "ccm", COMM_ID));

            var sql = SelectSql(
                columns: ["c." + CHAR_ID, "c.count",
                    CHAR_NM, CHAR_COLOR_TX, CHAR_SPECIES_TX, CHAR_DESC_TX, CHAR_IMG_PRESENT_IN, RETIRED_IN,
                    "cat." + CHAR_CAT_ID, CHAR_CAT_NM, CHAR_CAT_COLOR_TX, CHAR_CAT_DESC_TX, PRIMARY_CHAR_IN
                ], table: $"({SelectSql(
                        columns: [CHAR_ID, "count(*) as count"],
                        table: $"{COMM_CHAR_MAP} ccm, {COMM_TABLE} c",
                        new WhereConditionGroup(conditions)
                    )} GROUP BY {CHAR_ID}) c, {CHAR_TABLE} ch, {CHAR_CAT_TABLE} cat ",
                new WhereConditionGroup([new JoinCondition("c", "ch", CHAR_ID), new JoinCondition("ch","cat",CHAR_CAT_ID)]),
                order: [new("c.count", SortOrder.DESC)]
            );

            return await adoTemplate.Query(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                CommissionFilterApplier(filter, cmd);
            }, (reader) => new CommissionStatistics.CharacterCount() {
                Character = CharacterDAO.characterRm(reader),
                Count = reader.GetInt("count")
            });
        }

        private async Task<List<CommissionStatistics.TagCount>> GetTagCounts(string username, CommissionFilterOptions filter) {
            List<WhereCondition> conditions = CommissionFilterOptionsToWhereConditions(filter);
            conditions.Add(new JoinCondition("ct", "c", COMM_ID));

            var sql = SelectSql(
                columns: ["c.count","ct.*"], 
                table: $"({SelectSql(
                        columns: [COMM_TAG_ID, "count(*) as count"],
                        table: $"{COMM_TAG_MAP} ct, {COMM_TABLE} c",
                        new WhereConditionGroup(conditions)
                    )} GROUP BY {COMM_TAG_ID}) c, {COMM_TAG_TABLE} ct ",
                new WhereConditionGroup([new JoinCondition("c", "ct", COMM_TAG_ID)]),
                order: [new("c.count", SortOrder.DESC)]
            );

            return await adoTemplate.Query(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                CommissionFilterApplier(filter, cmd);
            }, (reader) => new CommissionStatistics.TagCount() {
                Tag = commTagRm(reader),
                Count = reader.GetInt("count")
            });
        }

        #endregion

    }
}
