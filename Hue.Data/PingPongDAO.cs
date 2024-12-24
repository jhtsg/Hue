using Hue.Data.Utils;

namespace Hue.Data {
    public class PingPongDao(string connectionString) {
        readonly AdoTemplate adoTemplate = new(connectionString);

        public class DbPingPong {
            public DateTime PingTime { get; set; }
            public DateTime? PongTime { get; set; }
            public bool Up => PongTime!=null;
        }

        #region READ

        public async Task<DbPingPong> PingPong() {

            DateTime pingTime = DateTime.UtcNow;
            var sql = "select CURRENT_TIMESTAMP";
            DateTime? pongTime;

            try {
                pongTime = await adoTemplate.QuerySingle(sql, (cmd) => { }, (reader) => reader.GetDateTime(0));
            } catch (Exception e) {
                Console.WriteLine(e.Message);
                pongTime = null;
            }

            return new DbPingPong { PingTime = pingTime, PongTime = pongTime };
            
        }

        #endregion

    }
}
