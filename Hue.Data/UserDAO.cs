using Hue.Common;
using Hue.Data.Utils;
using Igtampe.Hashbrown;
using static Hue.Data.Utils.Constants;

namespace Hue.Data
{
    public class UserDAO(string connectionString) {
        
        readonly Hashbrown hashbrown = new();
        readonly AdoTemplate adoTemplate = new(connectionString);

        readonly EnvironmentKey registerKey = new("REGISTER_KEY", ()=> "");

        //We'll need to add some other fields eventually or something
        public async Task<User?> GetUser(string username) {
            var sql = $@"SELECT {USER_NM} FROM {USER_TABLE} WHERE {USER_NM} = @username";
            return await adoTemplate.QuerySingle(sql, (cmd) => cmd.SetString("username", username), (reader) => {
                return new User() {
                    Username = reader.GetString(USER_NM)!,
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

        public async Task Register(string username, string password, string key) {

            if (registerKey.ToString().Length == 0) {
                throw new ArgumentException("No Registrations are accepted at this time");
            }

            if (!key.Equals(registerKey.ToString())) {
                throw new ArgumentException("Registration key is incorrect");
            }

            var sql = $"INSERT INTO {USER_TABLE} ({string.Join(",", [USER_NM, PASS_TX])}) VALUES (@username, @password)";

            await adoTemplate.Execute(sql, (cmd) => {
                cmd.SetString("username", username);
                cmd.SetString("password", hashbrown.Hash(password));
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
