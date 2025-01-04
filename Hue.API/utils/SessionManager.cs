using Hue.Common;
using Hue.Data;
using Hue.Data.Utils;
using Microsoft.Extensions.Caching.Memory;

namespace Hue.API.utils {
    public class SessionManager(string connectionString) {

        private readonly SessionDAO dao = new(connectionString);

        private readonly MemoryCache _cache = new(new MemoryCacheOptions());
        private readonly TimeSpan sessionMemoryTimespan = TimeSpan.FromMinutes(
            int.Parse(
                new OptionalEnvironmentKey("SESSION_MEMORY_TIMESTAMP_MINUTES").ToString() ?? "10"
            ));

        private readonly TimeSpan sessionDbTimespan = TimeSpan.FromDays(
            int.Parse(
                new OptionalEnvironmentKey("SESSION_DB_TIMESTAMP_DAYS").ToString() ?? "7"
            ));

        public async Task<Session?> FindSession(Guid? ID) {
            if (ID == null) return null; //Empty IDs are not found

            //Find the session in memory
            if (_cache.Get(ID) is Session memSession) {
                //It's in memory so we know its in the sliding window.
                //Is the DB up to date?

                //Is the creation time plus 7 days (the time in which the DB will expire) less than 10 minutes ago
                //(the time when the sliding window in memory will expire)
                if (memSession.CreationTime.Add(sessionDbTimespan) < DateTime.Now.Subtract(sessionMemoryTimespan)) {
                    //If so then extend it in DB
                    var dbExtendSession = await dao.ExtendSession(ID.Value);
                    if (dbExtendSession == null) {
                        //This was already expired or was logged out.
                        _cache.Remove(ID);
                        return null;
                    }
                    else {
                        return UpdateCache(dbExtendSession);
                    }
                }
                return memSession;
            }

            //Its not in memory
            //Find it in DB
            var dbSession = await dao.ExtendSession(ID.Value);
            if (dbSession == null) return null; //If it'sn ot in DB then oops
            if (dbSession.CreationTime.Add(sessionDbTimespan) < DateTime.Now) { //If it's in DB but its expired
                await LogOut(ID.Value); //Log out this session
                return null; //and adios
            }

            return UpdateCache(dbSession); //Otherwise its on DB but its not in cache. Add it to cache and return it

        }

        private Session UpdateCache(Session s) {
            _cache.Set(s.Id, s, new MemoryCacheEntryOptions() {
                SlidingExpiration = sessionMemoryTimespan
            });
            return s;

        }

        public async Task<Session> LogIn(string UserID) =>
             UpdateCache(
                    await dao.CreateSession(UserID) 
                    ?? throw new InvalidOperationException("This should never happen")
             );
        

        public async Task LogOut(Guid ID) {
            _cache.Remove(ID);
            await dao.DeleteSession(ID);
        }

    }
}
