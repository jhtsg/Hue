using static Hue.Data.Utils.SqlBuilder;
using static Hue.Data.Utils.Constants;

namespace Hue.Data.Utils {
    public static class OwnerChecker {

        public static async Task<bool> UserOwns(AdoTemplate template, string table, string username, string idColumn, int id) {
            var sql = SelectSql(["COUNT(*)"], table, new WhereConditionGroup(WhereConditionUnion.AND, [new(USER_NM), new(idColumn)]));
            return await template.QuerySingle(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                cmd.SetInt(idColumn, id);
            }, (reader) => reader.GetInt(0) == 1);
        }

        public static async Task<bool> UserOwnsAll(AdoTemplate template, string table, string username, string idColumn, List<int> ids) {
            if (ids.Count == 0) return true;
            var sql = SelectSql(["COUNT(*)"], table, new WhereConditionGroup(WhereConditionUnion.AND, [new(USER_NM), new(idColumn, ids.Select(A => $"{A}").ToList())]));
            return await template.QuerySingle(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
            }, (reader) => reader.GetInt(0) == ids.Count);
        }
    }
}
