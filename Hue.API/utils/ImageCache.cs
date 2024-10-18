using Hue.Common;
using System.Runtime.Caching;

namespace Hue.API.utils {

    /// <summary>Images are the largest thing we'll get, so we'll cache them instead </summary>
    public class ImageCache {
        private readonly ObjectCache _cache = MemoryCache.Default;
        private readonly CacheItemPolicy _policy;

        public ImageCache() {
            _policy = new CacheItemPolicy { SlidingExpiration = TimeSpan.FromMinutes(60)};
        }

        public void EvictFromCache(string key) => _cache.Remove(key);


        public ImageDownload? AddToCache(string key, ImageDownload? imageData) {
            if (imageData == null) return imageData;
            _cache.Set(key, imageData, _policy);
            return imageData;
        }

        public ImageDownload? GetFromCache(string key) => 
            !IsCached(key) 
                ? null 
                :  _cache.Get(key) as ImageDownload;
        

        public bool IsCached(string key) => _cache.Contains(key);
    }
}
