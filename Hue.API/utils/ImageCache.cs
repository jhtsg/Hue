using Hue.Common;
using Hue.Data.Utils;
using Microsoft.Extensions.Caching.Memory;

namespace Hue.API.utils {

    /// <summary>Images are the largest thing we'll get, so we'll cache them instead </summary>
    public class ImageCache {
        private readonly MemoryCache _cache = new(new MemoryCacheOptions());
        private readonly TimeSpan imageTimeSpan = TimeSpan.FromMinutes(
            int.Parse(
                new OptionalEnvironmentKey("IMAGE_CACHE_TIMESPAN").ToString() ?? "60"
            ));

        public ImageCache() {
        }

        public void EvictFromCache(string key) => _cache.Remove(key);

        public ImageDownload? AddToCache(string key, ImageDownload? imageData) {
            if (imageData == null) return imageData;
            _cache.Set(key, imageData, new MemoryCacheEntryOptions() { 
                SlidingExpiration = imageTimeSpan
            });
            return imageData;
        }

        public ImageDownload? GetFromCache(string key) => _cache.Get(key) as ImageDownload;

    }
}
