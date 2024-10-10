using Hue.Common.Statistics;
using Hue.Data.Utils;
using static Hue.Data.Utils.AdoTemplate;
using static Hue.Data.Utils.Constants;
using static Hue.Data.Utils.SqlBuilder;

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
            AverageSpentPerMonth = reader.GetInt(AVG_SPENT_NB),
            AverageTTC = reader.GetDouble(AVG_TTC_NB)
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

        private static Func<Getter, Statistic> StatisticRm(string idColumn, string nameColumn, string? colorColumn = null) {
            return (reader) => new() {
                Id = reader.GetInt(idColumn),
                Name = reader.GetString(nameColumn),
                Color = colorColumn == null ? "" : reader.GetString(colorColumn),
                Count = reader.GetInt(COMM_CNT),
                Spent = reader.GetInt(SPENT_NB),
                LastSeen = reader.GetDateTime(LAST_PBLSH_TS)
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
                LastSeen = reader.GetDateTime(LAST_PBLSH_TS)
            };
        }

        private static Func<Getter,Statistic> ArtistStatisticRm = StatisticRm(ARTIST_ID, ARTIST_NM);
        private static Func<Getter, StatisticByYear> YearlyArtistStatisticRm = YearlyStatisticRm(ARTIST_ID, ARTIST_NM);
        private static Func<Getter, Statistic> TagStatisticRm = StatisticRm(COMM_TAG_ID,COMM_TAG_NM,COMM_TAG_COLOR_TX);
        private static Func<Getter, StatisticByYear> YearlyTagStatisticRm = YearlyStatisticRm(COMM_TAG_ID,COMM_TAG_NM,COMM_TAG_COLOR_TX);
        private static Func<Getter, Statistic> CharStatisticRm = StatisticRm(CHAR_ID, CHAR_NM, CHAR_COLOR_TX);
        private static Func<Getter, StatisticByYear> YearlyCharStatisticRm = YearlyStatisticRm(CHAR_ID, CHAR_NM, CHAR_COLOR_TX);

        private async Task<List<Statistic>> GetOverallStatistics(string username, string view, Func<Getter,Statistic> rm) {
            var sql = SelectSql(["*"], view, new WhereConditionGroup([new(USER_NM), new(COMM_YEAR_NB)]));

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
        private async Task<Statistic?> GetOverallStatisticForItem(string username, string view, string idColumn, int id, Func<Getter, Statistic> rm) {
            var sql = SelectSql(["*"], view, new WhereConditionGroup([new(USER_NM), new(COMM_YEAR_NB)]));

            return await adoTemplate.QuerySingle (sql, (cmd) => {
                cmd.SetString(USER_NM, username);
            }, rm);

        }
        private async Task<StatisticByYear?> GetYearlyStatisticForItem(string username, string view, string idColumn, int id, int year, Func<Getter, StatisticByYear> rm) {
            var sql = SelectSql(["*"], view, new WhereConditionGroup([new(USER_NM), new(COMM_YEAR_NB)]));

            return await adoTemplate.QuerySingle(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                cmd.SetInt(COMM_YEAR_NB, year);
            }, rm);
        }

        public async Task<List<Statistic>> GetOverallArtistStatistics(string username) => await GetOverallStatistics(username, ARTIST_STATISTICS, ArtistStatisticRm);
        public async Task<List<StatisticByYear>> GetYearlyArtistStatistics(string username,int year) => await GetYearlyStatistics(username, YEARLY_ARTIST_STATISTICS, year, YearlyArtistStatisticRm);
        public async Task<Statistic?> GetOverallStatisticForArtist(string username, int id) => await GetOverallStatisticForItem(username, ARTIST_STATISTICS, ARTIST_ID, id, ArtistStatisticRm);
        public async Task<StatisticByYear?> GetYearlyStatisticForArtist(string username, int id, int year) => await GetYearlyStatisticForItem(username, ARTIST_STATISTICS, ARTIST_ID, id, year, YearlyArtistStatisticRm);

        public async Task<List<Statistic>> GetOverallCharacterStatistics(string username) => await GetOverallStatistics(username, CHAR_STATISTICS, CharStatisticRm);
        public async Task<List<StatisticByYear>> GetYearlyCharacterStatistics(string username, int year) => await GetYearlyStatistics(username, YEARLY_CHAR_STATISTICS, year, YearlyCharStatisticRm);
        public async Task<Statistic?> GetOverallStatisticForCharacter(string username, int id) => await GetOverallStatisticForItem(username, CHAR_STATISTICS, CHAR_ID, id, CharStatisticRm);
        public async Task<StatisticByYear?> GetYearlyStatisticForCharacter(string username, int id, int year) => await GetYearlyStatisticForItem(username, YEARLY_CHAR_STATISTICS, CHAR_ID, id, year, YearlyCharStatisticRm);

        public async Task<List<Statistic>> GetOverallTagStatistics(string username) => await GetOverallStatistics(username, TAG_STATISTICS, TagStatisticRm);
        public async Task<List<StatisticByYear>> GetYearlyTagStatistics(string username, int year) => await GetYearlyStatistics(username, YEARLY_TAG_STATISTICS, year, YearlyTagStatisticRm);
        public async Task<Statistic?> GetOverallStatisticForTag(string username, int id) => await GetOverallStatisticForItem(username, TAG_STATISTICS, COMM_TAG_ID, id, TagStatisticRm);
        public async Task<StatisticByYear?> GetYearlyStatisticForTag(string username, int id, int year) => await GetYearlyStatisticForItem(username, YEARLY_TAG_STATISTICS, COMM_TAG_ID, id, year, YearlyTagStatisticRm);

        #endregion

    }
}
