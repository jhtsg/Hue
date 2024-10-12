using Hue.Common;
using Hue.Data.Utils;
using Igtampe.Hashbrown;
using static Hue.Data.Utils.Constants;
using static Hue.Data.Utils.SqlBuilder;

namespace Hue.Data
{
    public class UserDAO(string connectionString) {
        
        readonly Hashbrown hashbrown = new();
        readonly AdoTemplate adoTemplate = new(connectionString);

        readonly EnvironmentKey registerKey = new("REGISTER_KEY", ()=> "");

        //We'll need to add some other fields eventually or something
        public async Task<User?> GetUser(string username) {

            var sql = SelectSql(
                columns: ["U." + USER_NM,ARTIST_IN,CHAR_ID,CHAR_COLOR_TX],
                table: $"{USER_TABLE} u left join {CHAR_TABLE} c on c.{USER_NM} = u.{USER_NM} and {PRIMARY_CHAR_IN}", 
                new WhereConditionGroup([
                    new("u." + USER_NM, WhereConditionOperator.EQUALS,$"@{USER_NM}"),
                ])
            );

            return await adoTemplate.QuerySingle(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
            }, (reader) => {
                return new User() {
                    Username = reader.GetString(USER_NM),
                    IsArtist = reader.GetBoolean(ARTIST_IN),
                    PrimaryCharacterColor = reader.GetOptionalString(CHAR_COLOR_TX),
                    PrimaryCharacterId = reader.GetOptionalInt(CHAR_ID)
                };
            });
        }

        public async Task<bool> Authenticate(string username, string password) { 

            var sql = $"SELECT COUNT(*) FROM {USER_TABLE} WHERE {USER_NM} = @username AND {PASS_TX} = @password";

            return await adoTemplate.QuerySingle(sql, 
                (cmd) => {
                    cmd.SetString("username", username);
                    cmd.SetString("password", hashbrown.Hash(password));
                },
                (reader) => reader.GetInt(0) > 0);
        
        }

        public async Task Register(string username, string password, string key, bool isArtist) {

            if (registerKey.ToString().Length == 0) {
                throw new ArgumentException("No Registrations are accepted at this time");
            }

            if (!key.Equals(registerKey.ToString())) {
                throw new ArgumentException("Registration key is incorrect");
            }

            var sql = InsertSql([USER_NM, PASS_TX, ARTIST_IN], USER_TABLE);

            await adoTemplate.Execute(sql, (cmd) => {
                cmd.SetString(USER_NM, username);
                cmd.SetString(PASS_TX, hashbrown.Hash(password));
                cmd.SetBoolean(ARTIST_IN, isArtist);
            });
        }

        public async Task UpdatePassword(string username, string oldPassword, string newPassword) {

            if (!await Authenticate(username, oldPassword)) {
                throw new ArgumentException("Incorrect password");
            }
            
            var sql = $"UPDATE {USER_TABLE} SET {PASS_TX} = @password WHERE {USER_NM} = @username";

            await adoTemplate.Execute(sql, (cmd) => {
                cmd.SetString("username", username);
                cmd.SetString("password", hashbrown.Hash(newPassword));
            });
        }
    }
}
