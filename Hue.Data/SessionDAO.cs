using Hue.Common;
using Hue.Data.Utils;
using static Hue.Data.Utils.SqlBuilder;
using static Hue.Data.Utils.Constants;
using static Hue.Data.Utils.AdoTemplate;

namespace Hue.Data {
    public class SessionDAO(string connectionString) {

        readonly AdoTemplate adoTemplate = new(connectionString);

        private static Session SessionRm(Getter reader) => new() { 
            Id= reader.GetGuid(SESSION_ID),
            Username = reader.GetString(USER_NM),
            CreationTime = reader.GetDateTime(CRE_TS)
        };

        public async Task<Session?> CreateSession(string username) {
            var sql = InsertSql([USER_NM], SESSION_TABLE, "*");
            return await adoTemplate.QuerySingle(sql,
                    (cmd) => cmd.SetString(USER_NM,username), SessionRm);
        }
        
        public async Task<Session?> GetSession(Guid id) {
            var sql = SelectSql(["*"], SESSION_TABLE, new WhereConditionGroup([new(SESSION_ID)]));
            return await adoTemplate.QuerySingle(sql, (cmd) => cmd.SetGuid(SESSION_ID,id), SessionRm);
        }
        public async Task<Session?> ExtendSession(Guid id) {
            var sql = UpdateSql([CRE_TS], new() {
                { CRE_TS, "NOW()"}
            }, SESSION_TABLE, new([new(SESSION_ID)])) + " returning *";
            return await adoTemplate.QuerySingle(sql, (cmd)=>cmd.SetGuid(SESSION_ID,id), SessionRm);
        }
        
        public async Task DeleteSession(Guid id) {
            var sql = DeleteSql(
                table: SESSION_TABLE,
                conditions: new([new(SESSION_ID)]));

            await adoTemplate.Execute(sql, 
                setter: (cmd) => cmd.SetGuid(SESSION_ID, id)
            );
        }
    }
}
